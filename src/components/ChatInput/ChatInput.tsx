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
import { ChatMessage, ChatActionsTypes, MessagesTypes } from '@/interfaces/chat.interface';
import { useDispatch } from 'react-redux';
import { useVoiceMemoRecorder } from '@/Hooks/useVoiceMemoRecorder';
import { voiceMemoTimer } from '@/utils/chat.util';
import getBlobDuration from 'get-blob-duration';
import { v4 as uuid } from 'uuid';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import AttachFile from '../AttachFile';
import { setAttchFileMenuOpen, setSystemNotification } from '@/redux/system.slice';
import {
  ChatActions,
  ChatCard,
  addMessageToChat,
  addNewChat,
  placeLastUpdatedChatToTheTop,
  setChatLastMessage,
  setCurrentUsrDoingAction,
} from '@/redux/chats.slice';
import { getFileSize } from '@/utils/files';
import { useSearchParams } from 'next/navigation';

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
  const { attachFileMenuOpen, currentUsr, chatMessages, openedChat } = useSelector((state: RootState) => {
    return {
      currentUsr: state.auth.currentUser,
      attachFileMenuOpen: state.system.attchFileMenuOpen,
      chatMessages: state.chat.chatMessages,
      openedChat: state.chat.openedChat,
    };
  });
  // translatios
  const { t } = useTranslation('chatScreen');
  // url params
  const urlSearchParams = useSearchParams();
  // handleInputFocus
  const handleInputFocus = () => {
    // TODO: make chat members ids a global variable
    // chat members IDs
    const openedChatMembersIDs = openedChat?.members.map((member) => member._id);
    // chatAction
    const chatAction: ChatActions = {
      type: ChatActionsTypes.TYPEING,
      chatId: openedChat!._id,
      chatMembers: openedChatMembersIDs!,
      senderId: currentUsr!._id,
    };
    // set loggedInUser Doing Action
    dispatch(setCurrentUsrDoingAction(chatAction));
  };
  // handleInputBlur
  const handleInputBlur = () => {
    // TODO: make chat members ids a global variable
    // chat members IDs
    const openedChatMembersIDs = openedChat?.members.map((member) => member._id);
    // chatAction
    const chatAction: ChatActions = {
      type: null,
      chatId: openedChat!._id,
      chatMembers: openedChatMembersIDs!,
      senderId: currentUsr!._id,
    };
    // set loggedInUser Doing Action
    dispatch(setCurrentUsrDoingAction(chatAction));
  };
  // inputChangeHandler
  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => setInputText(event.target.value);
  // start recording voice
  const startRecVoiceMemoHandler = async () => {
    // start recording voice
    try {
      await start();
      // chat members IDs
      const openedChatMembersIDs = openedChat?.members.map((member) => member._id);
      // chatAction
      const chatAction: ChatActions = {
        type: ChatActionsTypes.RECORDING_VOICE,
        chatId: openedChat!._id,
        chatMembers: openedChatMembersIDs!,
        senderId: currentUsr!._id,
      };
      // tell the server about is currently recording voice to inform another usr in the chat
      dispatch(setCurrentUsrDoingAction(chatAction));
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
    // chat members IDs
    const openedChatMembersIDs = openedChat?.members.map((member) => member._id);
    // chatAction
    const chatAction: ChatActions = {
      type: null,
      chatId: openedChat!._id,
      chatMembers: openedChatMembersIDs!,
      senderId: currentUsr!._id,
    };
    // set loggedInUser Doing Action
    dispatch(setCurrentUsrDoingAction(chatAction));
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
    // textMessage
    const textMessage: ChatMessage = { ...message, content: inputText, type: MessagesTypes.TEXT, fileName, fileSize };
    // check if it's first message in the chat
    if (chatMessages?.length === 0) {
      // create chat card
      const chatCard: ChatCard = { lastMessage: textMessage, unReadedMsgs: 1, ...openedChat! };
      // add chat top the top
      dispatch(addNewChat(chatCard));
    }
    // push message to the chat
    dispatch(addMessageToChat(textMessage));
    // clear the input
    setInputText('');
    // change chat last message
    dispatch(setChatLastMessage({ msg: textMessage, currentUserId: currentUsr!._id }));
  };
  // send voice message
  const sendVoiceMessage = async (message: ChatMessage) => {
    // send voice msg if it's recording and input is empty
    if (!isRec || inputText) return;
    // make current usr doing nothing
    // chat members IDs
    const openedChatMembersIDs = openedChat?.members.map((member) => member._id);
    // chatAction
    const chatAction: ChatActions = {
      type: null,
      chatId: openedChat!._id,
      chatMembers: openedChatMembersIDs!,
      senderId: currentUsr!._id,
    };
    // set loggedInUser Doing Action
    dispatch(setCurrentUsrDoingAction(chatAction));
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
      const fileName = `AUDIO-${message.sender._id}-${message.receiverId}${String(Math.random())}`;
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
      // change chat last message
      dispatch(setChatLastMessage({ msg: voiceNoteMessage, currentUserId: currentUsr!._id }));
    };
    // on voice reader load
    reader.addEventListener('load', voiceLoadHandler);
  };
  // handleSendBtnClick Icon Click Action
  const handleSendBtnClick = async () => {
    // chat message
    const message = {
      _id: uuid(),
      receiverId: urlSearchParams.get('id'),
      sender: currentUsr,
      date: new Date().toString(),
      status: null,
    } as ChatMessage;
    // place current chat to the top
    dispatch(placeLastUpdatedChatToTheTop({ chatId: urlSearchParams.get('id')! }));
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
