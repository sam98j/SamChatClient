/* eslint-disable react/no-unknown-property */
import { Box, IconButton, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import styles from './styles.module.scss';
import React, { useState } from 'react';
import { Icon } from '@chakra-ui/icons';
import { BsMic, BsSoundwave, BsStopFill } from 'react-icons/bs';
import { ImAttachment } from 'react-icons/im';
import { BiSticker } from 'react-icons/bi';
import useTranslation from 'next-translate/useTranslation';
import { IoSend } from 'react-icons/io5';
import { ChatMessage, ChatUserActions, MessagesTypes } from '@/interfaces/chat.interface';
import { useDispatch } from 'react-redux';
import { useVoiceMemoRecorder } from '@/Hooks/useVoiceMemoRecorder';
import { voiceMemoTimer } from '@/utils/chat.util';
import getBlobDuration from 'get-blob-duration';
import { v4 as uuid } from 'uuid';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import AttachFile from '../AttachFile';
import { setAttchFileMenuOpen, setSystemNotification } from '@/redux/system.slice';
import { addMessageToChat, setCurrentUsrDoingAction } from '@/redux/chats.slice';
import { getFileSize } from '@/utils/files';

const ChatInput = () => {
  const { start, stop, cancel } = useVoiceMemoRecorder();
  // input text
  const [inputText, setInputText] = useState('');
  // is voice recording
  const [isRec, setIsReco] = useState(false);
  // timer
  const [timer, setTimer] = useState('00:00');
  // timer interval
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timer>();
  // redux dispatch method
  const dispatch = useDispatch();
  // locales
  const { locale } = useRouter();
  // current logged usr
  const { attachFileMenuOpen, currentUsr } = useSelector((state: RootState) => {
    return { currentUsr: state.auth.currentUser, attachFileMenuOpen: state.system.attchFileMenuOpen };
  });
  // url params
  const parmas = useSearchParams();
  // translatios
  const { t } = useTranslation('chatScreen');
  // handleInputFocus
  const handleInputFocus = () => dispatch(setCurrentUsrDoingAction(ChatUserActions.TYPEING));
  // handleInputBlur
  const handleInputBlur = () => dispatch(setCurrentUsrDoingAction(null));
  // inputChangeHandler
  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => setInputText(event.target.value);
  // start recording voice
  const startRecVoiceMemoHandler = async () => {
    // start recording voice
    try {
      await start();
      // tell the server about is currently recording voice to inform another usr in the chat
      dispatch(setCurrentUsrDoingAction(ChatUserActions.RECORDING_VOICE));
      // set voice recording state
      setIsReco(true);
      setTimerInterval(voiceMemoTimer(setTimer));
    } catch (err) {
      // init voice recorder err
      const { message: msg } = err as Error;
      dispatch(setSystemNotification({ err: true, msg }));
    }
  };
  // handle stop recrding vioice
  const stopRecVoiceMemoHandler = () => {
    // tell server about usr is currently stop recording voice to inform another usr in chat
    dispatch(setCurrentUsrDoingAction(null));
    // set voice recording state
    setIsReco(false);
    // cancerl recording
    cancel();
    clearInterval(timerInterval);
  };
  // send text message
  const sendTextMessage = (message: ChatMessage) => {
    // create meassge
    if (!inputText) return;
    // text message file name (null)
    const fileName = null;
    // text message file size (null)
    const fileSize = null;
    // push message to the chat
    dispatch(addMessageToChat({ ...message, content: inputText, type: MessagesTypes.TEXT, fileName, fileSize }));
    // clear the input
    setInputText('');
  };
  // send voice message
  const sendVoiceMessage = async (message: ChatMessage) => {
    // send voice msg if it's recording and input is empty
    if (!isRec || inputText) return;
    // make current usr doing nothing
    dispatch(setCurrentUsrDoingAction(null));
    // stop voice memo counter
    clearInterval(timerInterval);
    const blob = await stop();
    const reader = new FileReader();
    // read row voice data as data url
    reader.readAsDataURL(blob as Blob);
    // voice note reader load handler
    const voiceLoadHandler = async (e: ProgressEvent<FileReader>) => {
      // get voice memo duration in seconds from blob data (row data)
      const duration = await getBlobDuration(e.target?.result as string);
      // voiceNoteDuration
      const voiceNoteDuration = String(Math.round(duration));
      // voice message content
      const content = e.target?.result as string;
      // voice message file name (null)
      const fileName = `AUDIO-${message.senderId}-${message.receiverId}${String(Math.random())}`;
      // voice message file size (null)
      const fileSize = getFileSize(content);
      // msg type
      const type = MessagesTypes.VOICENOTE;
      // voice note message
      const voiceNoteMessage: ChatMessage = { ...message, voiceNoteDuration, content, type, fileName, fileSize };
      // add message to the chat
      dispatch(addMessageToChat(voiceNoteMessage));
      // set isRec
      setIsReco(false);
    };
    // on voice reader load
    reader.addEventListener('load', voiceLoadHandler);
  };
  // handleSendBtnClick Icon Click Action
  const handleSendBtnClick = async () => {
    // chat message
    const message = {
      _id: uuid(),
      receiverId: parmas.get('id'),
      senderId: currentUsr,
      date: new Date().toString(),
      status: null,
    } as ChatMessage;
    // if text message
    if (inputText && !isRec) return sendTextMessage(message);
    // if voice message
    sendVoiceMessage(message);
  };
  // handleAttachFile Icon Click action
  const handleAttachFile = () => {
    const attchFileMenuStatus = attachFileMenuOpen ? false : true;
    dispatch(setAttchFileMenuOpen(attchFileMenuStatus));
  };
  // display send message btn in tow case (text input is has a text or usr is recording msg)
  const showSendMsgBtn = isRec || inputText;
  // decide to render attachment or flashing mic icon
  const MicOrAttchIcon = isRec ? BsMic : ImAttachment;
  //
  return (
    <div className={styles.footer} pref-lang={locale}>
      {/* attach file menu */}
      <AttachFile />
      {/* attach and flashing mic */}
      <IconButton
        aria-label=''
        isRound={true}
        is-voice-rec={String(isRec)}
        className={styles.mic_atta_icon}
        onClick={handleAttachFile}
      >
        <MicOrAttchIcon />
      </IconButton>
      {/* voice message timer */}
      <Box flexGrow={'1'} textColor={'gray'} display={!isRec ? 'none' : 'flex'}>
        <Text> {timer} </Text>
        <Text>{t('rec_voice')}</Text>
      </Box>
      {/* write text message box */}
      <InputGroup display={isRec ? 'none' : 'initial'}>
        <InputRightElement className={styles.input_inner_icon}>
          <Icon as={BiSticker} boxSize={5} color={'messenger.500'} />
        </InputRightElement>
        <Input
          variant='filled'
          placeholder={t('typeMessagePlaceholder')}
          borderRadius={'20px'}
          value={inputText}
          name='msgText'
          onChange={inputChangeHandler}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </InputGroup>
      {/* btn to stop voice recording */}
      {isRec ? <BsStopFill onClick={stopRecVoiceMemoHandler} color='red' size='2rem' /> : ''}
      {/* start recording voice message btn */}
      {!isRec && !inputText ? <BsSoundwave onClick={startRecVoiceMemoHandler} color='#1e90ff' size={'2.5rem'} /> : ''}
      {/* send message btn */}
      {showSendMsgBtn ? <IoSend onClick={handleSendBtnClick} className={styles.send_btn} size='1.5rem' /> : ''}
    </div>
  );
};

export default ChatInput;
