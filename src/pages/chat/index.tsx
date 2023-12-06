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
import { setChatMessagesBatchNo, setOpenedChat } from '@/redux/chats.slice';
import { getChatMessages, getUsrOnlineStatus } from '@/apis/chats.api';
import ChatMassage from '@/components/ChatMassage';
import { setCurrentRoute } from '@/redux/system.slice';
import { AnyAction } from '@reduxjs/toolkit';
import ChatInput from '@/components/ChatInput/ChatInput';
import { groupChatMessagesByDate } from '@/utils/chat.util';
import { ChatMessage } from '@/interfaces/chat.interface';
import { useRouter } from 'next/router';

const Chat = () => {
  // get local
  const { locale } = useRouter();
  // redux store dispatch function
  const dispatch = useDispatch();
  // use ref
  const chatRef = useRef<HTMLDivElement>(null);
  // data from the store
  const { chatMessages, chatName, openedChat, chats, messagesBatchNo } = useSelector((state: RootState) => {
    return {
      openedChat: state.chat.openedChat,
      chatMessages: state.chat.chatMessages,
      chatName: state.system.currentRoute,
      chats: state.chat.chats,
      messagesBatchNo: state.chat.chatMessagesBatchNo,
    };
  });
  chatRef.current?.addEventListener('scroll', () => {
    if (chatRef.current?.scrollTop === 0) {
      console.log('fetching new messages');
      // get chat messages based on page no
      dispatch(
        getChatMessages({ chatUsrId: parmas.get('id')!, msgBatch: messagesBatchNo + 1 }) as unknown as AnyAction
      );
      dispatch(setChatMessagesBatchNo(messagesBatchNo + 1));
    }
  });
  const parmas = useSearchParams();
  const messages = groupChatMessagesByDate(chatMessages as ChatMessage[], locale as never)!;
  // open chat state
  const [cachedOpenedChat] = useState(() => chats?.filter((chat) => chat.usrid === (parmas.get('id') as string))[0]);
  // scroll to the bottom of the view
  useEffect(() => {
    if (messagesBatchNo > 1) return;
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [chatMessages, messagesBatchNo]);
  // component did mount life cicle hook
  useEffect(() => {
    // set opend chat
    if (!openedChat) {
      dispatch(
        setOpenedChat({
          id: cachedOpenedChat?.usrid as string,
          usrname: cachedOpenedChat?.usrname as string,
          avatar: cachedOpenedChat?.avatar as string,
        })
      );
    }
    // get usr online status
    dispatch(getUsrOnlineStatus(parmas.get('id')!) as unknown as AnyAction);
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
    dispatch(setCurrentRoute(openedChat!.usrname!));
  }, [openedChat]);
  // dummy messages
  return (
    <>
      <Head>
        <title>{chatName}</title>
      </Head>
      <div className={styles.chat} ref={chatRef}>
        {/* chat messages */}
        {chatMessages === null ? (
          <Spinner className={styles.spinner} />
        ) : chatMessages.length === 0 ? (
          <Box className={styles.imgContainer}>
            <NextImage src={NoMessageDrow} alt='' />
            <Text textColor={'gray'} fontSize={'1.5rem'}>
              No Messages Yet
            </Text>
          </Box>
        ) : (
          messages.dates?.map((date, i) => {
            return (
              <>
                <Text textAlign={'center'} textColor={'gray'}>
                  {date}
                </Text>
                {messages?.messages[i]?.map((msg: ChatMessage) => (
                  <ChatMassage messageData={msg} key={''} />
                ))}
              </>
            );
          })
        )}
        {/* chat footer */}
        <ChatInput />
      </div>
    </>
  );
};

export default Chat;
