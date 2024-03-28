import { Box, IconButton, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import styles from './styles.module.scss';
import React, { useState } from 'react';
import { Icon } from '@chakra-ui/icons';
import { BsMic, BsStopFill } from 'react-icons/bs';
import { ImAttachment } from 'react-icons/im';
import { BiSticker } from 'react-icons/bi';
import useTranslation from 'next-translate/useTranslation';
import { IoSend } from 'react-icons/io5';
import { ChatMessage, ChatUserActions, MessagesTypes } from '@/interfaces/chat.interface';
import { useDispatch } from 'react-redux';
import VoiceMemoRecorder from '@/utils/voiceMemoRecorder';
import { voiceMemoTimer } from '@/utils/chat.util';
import getBlobDuration from 'get-blob-duration';
import { v4 as uuid } from 'uuid';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import AtachFile from '../AtachFile';
import { setAttchFileMenuOpen } from '@/redux/system.slice';
import { addMessageToChat, setCurrentUsrDoingAction } from '@/redux/chats.slice';
const { start, stop, cancel } = VoiceMemoRecorder();

const ChatInput = () => {
  // redux dispatch method
  const dispatch = useDispatch();
  // locales
  const { locale } = useRouter();
  // input text
  const [inputText, setInputText] = useState('');
  // timer interval
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timer>();
  // current logged usr
  const { attachFileMenuOpen, currentUsr } = useSelector((state: RootState) => {
    return { currentUsr: state.auth.currentUser, attachFileMenuOpen: state.system.attchFileMenuOpen };
  });
  // url params
  const parmas = useSearchParams();
  // translatios
  const { t } = useTranslation('chatScreen');
  // is voice recording
  const [isRec, setIsReco] = useState(false);
  // timer
  const [timer, setTimer] = useState('00:00');
  // handleInputFocus
  const handleInputFocus = () => dispatch(setCurrentUsrDoingAction(ChatUserActions.TYPEING));
  // handleInputBlur
  const handleInputBlur = () => dispatch(setCurrentUsrDoingAction(null));
  // inputChangeHandler
  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };
  // start recording voice
  const startRecVoiceMemoHandler = async () => {
    // tell the server about is currently recording voice to inform another usr in the chat
    dispatch(setCurrentUsrDoingAction(ChatUserActions.RECORDING_VOICE));
    // start recording voice
    await start();
    // set voice recording state
    setIsReco(true);
    setTimerInterval(voiceMemoTimer(setTimer));
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
    // push message to the chat
    dispatch(addMessageToChat({ ...message, content: inputText, type: MessagesTypes.TEXT }));
    // clear the input
    setInputText('');
  };
  // send voice message
  const sendVoiceMessage = async (message: ChatMessage) => {
    // send voice msg if it's recording and input is empty
    if (!isRec || inputText) return;
    dispatch(setCurrentUsrDoingAction(null));
    clearInterval(timerInterval);
    const blob = await stop();
    const reader = new FileReader();
    reader.readAsDataURL(blob as Blob);
    // voice note reader load handler
    const voiceLoadHandler = async (e: ProgressEvent<FileReader>) => {
      const duration = await getBlobDuration(e.target?.result as string);
      // new Audio(e.target?.result as string, {ty});
      const voiceNoteMessage = {
        ...message,
        voiceNoteDuration: String(Math.round(duration)),
        content: e.target?.result as string,
        type: MessagesTypes.VOICENOTE,
      } as ChatMessage;
      dispatch(addMessageToChat(voiceNoteMessage));
      // set isRec
      setIsReco(false);
    };
    // on voice reader load
    reader.addEventListener('load', voiceLoadHandler);
  };
  // handleSendBtnClick
  const handleSendBtnClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // chat message
    const message = {
      _id: uuid(),
      receiverId: parmas.get('id'),
      senderId: currentUsr,
      date: new Date().toString(),
      status: null,
    } as ChatMessage;
    // if text message
    if (inputText && !isRec) {
      sendTextMessage(message);
      return;
    }
    // if voice message
    sendVoiceMessage(message);
  };
  // handleAttachFile
  const handleAttachFile = () => {
    const attchFileMenuStatus = attachFileMenuOpen ? false : true;
    dispatch(setAttchFileMenuOpen(attchFileMenuStatus));
  };
  return (
    <Box
      className={styles.footer}
      bgColor={'gray.50'}
      gap={4}
      padding={'10px'}
      display={'flex'}
      alignItems={'center'}
      pref-lang={locale}
    >
      <AtachFile />
      {/* attach and flashing mic */}
      <IconButton
        aria-label=''
        isRound={true}
        is-voice-rec={String(isRec)}
        className={styles.mic_atta_icon}
        onClick={handleAttachFile}
      >
        <Icon as={isRec ? BsMic : ImAttachment} boxSize={5} color={'messenger.500'} />
      </IconButton>
      <Box flexGrow={'1'} textColor={'gray'} display={!isRec ? 'none' : 'flex'}>
        <Text> {timer} </Text>
        <Text>{t('rec_voice')}</Text>
      </Box>
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
      {isRec ? (
        <IconButton
          icon={<Icon as={BsStopFill} />}
          isRound={true}
          aria-label=''
          colorScheme={'red'}
          onClick={stopRecVoiceMemoHandler}
        />
      ) : (
        ''
      )}
      {!isRec && !inputText ? (
        <IconButton
          icon={<Icon as={BsMic} boxSize={5} />}
          isRound={true}
          aria-label=''
          colorScheme={'messenger'}
          onClick={startRecVoiceMemoHandler}
        />
      ) : (
        ''
      )}
      {isRec || inputText ? (
        <IconButton
          onClick={handleSendBtnClick}
          isRound={true}
          className={styles.send_btn}
          icon={<Icon as={IoSend} boxSize={5} color={'white'} />}
          aria-label=''
          colorScheme={'messenger'}
        />
      ) : (
        ''
      )}
    </Box>
  );
};

export default ChatInput;
