/* eslint-disable no-constant-condition */
/* eslint-disable react/no-unknown-property */
import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { Box, Spinner, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import NextImage from 'next/image';
import NoMessageDrow from '../../../assets/vectors/undraw_new_message_re_fp03.svg';
import { useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { ChatTypes, setChatMessagesBatchNo, setChatUsrStatus, setOpenedChat } from '@/redux/chats.slice';
import { getChatMessages, getUsrOnlineStatus } from '@/apis/chats.api';
import { setAttchFileMenuOpen, setCurrentRoute } from '@/redux/system.slice';
import { AnyAction } from '@reduxjs/toolkit';
import ChatInput from '@/components/ChatInput/ChatInput';
import { groupChatMessagesByDate } from '@/utils/chat.util';
import { ChatMessage } from '@/interfaces/chat.interface';
import { useRouter } from 'next/router';
import ChatMessagesLoader from '@/components/ChatMessagesLoader';

const Chat = () => {
  // get local
  const { locale } = useRouter();
  // redux store dispatch function
  const dispatch = useDispatch();
  // use ref
  const chatRef = useRef<HTMLDivElement>(null);
  // data from the store
  const { chatMessages, chatName, openedChat, chats, messagesBatchNo, isLastChatMessagesBatch, isAttachFileMenuOpened } =
    useSelector((state: RootState) => {
      return {
        openedChat: state.chat.openedChat,
        chatMessages: state.chat.chatMessages,
        chatName: state.system.currentRoute,
        chats: state.chat.chats,
        messagesBatchNo: state.chat.chatMessagesBatchNo,
        isLastChatMessagesBatch: state.chat.isLastChatMessagesBatch,
        isAttachFileMenuOpened: state.system.attchFileMenuOpen,
      };
    });
  // when usr scroll throwout the messages
  chatRef.current?.addEventListener('scrollend', () => {
    // when usr reach last oldest message
    if (isLastChatMessagesBatch) return;
    if (chatRef.current?.scrollTop === 0 && !isLastChatMessagesBatch) {
      // terminate if it's last batch of chat messages
      console.log('fetching new messages', isLastChatMessagesBatch);
      // get chat messages based on page no
      dispatch(getChatMessages({ chatUsrId: parmas.get('id')!, msgBatch: messagesBatchNo + 1 }) as unknown as AnyAction);
      dispatch(setChatMessagesBatchNo(messagesBatchNo + 1));
    }
  });
  // when usr click on chat screen
  chatRef.current?.addEventListener('click', () => {
    // check if attach file menu is closed
    if (!isAttachFileMenuOpened) return;
    // if it's opened then close it
    dispatch(setAttchFileMenuOpen(false));
    console.log('chat clicked');
  });
  // url parmas
  const parmas = useSearchParams();
  // split chat messages with dates
  const messages = groupChatMessagesByDate(chatMessages as ChatMessage[], locale as never)!;
  // open chat state
  const [cachedOpenedChat] = useState(() => chats?.filter((chat) => chat._id === (parmas.get('id') as string))[0]);
  // scroll to the bottom of the view
  useEffect(() => {
    if (messagesBatchNo > 1) return;
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [chatMessages, messagesBatchNo]);
  // component did mount life cicle hook
  useEffect(() => {
    // set opend chat
    if (!openedChat) {
      dispatch(setOpenedChat(cachedOpenedChat));
    }
    // get usr online status
    if (openedChat?.type === ChatTypes.INDIVISUAL) dispatch(getUsrOnlineStatus(parmas.get('id')!) as unknown as AnyAction);
    // get usr online status
    if (openedChat?.type === ChatTypes.GROUP) dispatch(setChatUsrStatus(null));
    // clean up when component unmount
    return function cleanUp() {
      dispatch(setOpenedChat(undefined));
      dispatch(setChatMessagesBatchNo(1));
    };
  }, []);
  // listen for opened chat
  useEffect(() => {
    if (!openedChat) return;
    // get chats messages
    dispatch(getChatMessages({ chatUsrId: parmas.get('id')!, msgBatch: messagesBatchNo }) as unknown as AnyAction);
    // set route name
    dispatch(setCurrentRoute(openedChat!.name!));
  }, [openedChat]);
  // dummy messages
  return (
    <>
      <Head>
        <title>{chatName}</title>
      </Head>
      <div className={styles.chat} ref={chatRef}>
        {/* if chat messages is loading */}
        {chatMessages === null ? <Spinner className={styles.spinner} /> : ''}
        {/* if chat messages not loading and there is no messages */}
        {chatMessages !== null && chatMessages.length === 0 ? (
          // no messages avatar
          <Box className={styles.imgContainer}>
            <NextImage src={NoMessageDrow} alt='' />
            <Text textColor={'gray'} fontSize={'1.5rem'}>
              No Messages Yet
            </Text>
          </Box>
        ) : (
          ''
        )}
        {/* load chat messages */}
        {messages !== undefined ? <ChatMessagesLoader messages={messages} /> : ''}
        {/* chat footer */}
        <ChatInput />
      </div>
    </>
  );
};

export default Chat;
