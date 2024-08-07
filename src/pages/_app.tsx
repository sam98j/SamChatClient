import { RootState, store, wrapper } from '@/redux/store';
import React, { useState } from 'react';
import '@/styles/globals.css';
import styles from './index.module.scss';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import AppHeader from '@/components/AppHeader';
import { useDispatch } from 'react-redux';
import { getUserChats } from '@/apis/chats.api';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import CreateChat from '@/components/CreateChat';
import Head from 'next/head';
import AppLogo from '@/components/AppLogo';
import { AnyAction } from '@reduxjs/toolkit';
import { extendTheme } from '@chakra-ui/react';
import { playReceiveMessageSound, playSentMessageSound } from '@/utils/chat.util';
import { ChatMessage, MessageStatus } from '@/interfaces/chat.interface';
import {
  addMessageToChat,
  setChatUsrStatus,
  setMessageStatus,
  setOpenedChat,
  setChatUsrDoingAction,
  addNewChat,
  placeLastUpdatedChatToTheTop,
} from '@/redux/chats.slice';
import { usePathname, useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { setNewIncomingMsg } from '@/redux/system.slice';
import useChatMessagesSender from '@/Hooks/useChatMsgSender';
import SystemNotifications from '@/components/SystemNotifications/SystemNotifications';
import usePushNotifications from '@/Hooks/usePushNotifications';
import { SessionProvider } from 'next-auth/react';
import CreateChatGroupMenu from '@/components/CreateChatGroupMenu';

function App({ Component, ...pageProps }: AppProps) {
  // chakra theme
  const theme = extendTheme({ fonts: { body: '"Baloo Bhaijaan 2", cursive' } });
  // back end api
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // socket instance
  const [socketClient, setSocket] = useState<Socket | null>(null);
  // multichunk msg
  const { sendChatMessage } = useChatMessagesSender(socketClient!);
  // use push notifications
  const { enablePushNotification } = usePushNotifications();
  // use path
  const pathname = usePathname();
  // router
  const { push } = useRouter();
  // search params
  const parmas = useSearchParams();
  // store dispatch func
  const dispatch = useDispatch();
  // system state
  const { isCreateChatGroupMenuOpen } = useSelector((state: RootState) => state.system);
  // auth state
  const { apiResponse, currentUser } = useSelector((state: RootState) => state.auth);
  // system notifications
  const systemNotifications = useSelector((state: RootState) => state.system.notifications);
  // chat state
  const { openedChat, isCurrentUsrDoingAction, messageToBeMarketAsReaded, chatMessages } = useSelector(
    (state: RootState) => state.chat
  );
  // listen for multichunk msg
  useEffect(() => {
    // terminate if chat's messages not fetched yet
    if (!chatMessages) return;
    // msgs  to sent
    const messagesToSent = chatMessages.filter((msg) => msg.status === null);
    // terminate if there is no message waiting for send
    if (!messagesToSent[0]) return;
    // send
    sendChatMessage(messagesToSent[0]);
  }, [chatMessages]);
  // listen to isCurrentUsrDoingAction
  useEffect(() => {
    // chatusr_start_typing
    socketClient?.emit('chatusr_typing_status', {
      cUsrId: currentUser,
      chatUsrId: parmas.get('id'),
      action: isCurrentUsrDoingAction,
    });
  }, [isCurrentUsrDoingAction]);
  // listen for chat user doing action
  useEffect(() => {
    // listen for chat usr doing action
    socketClient?.on('chatusr_typing_status', (actionData) => dispatch(setChatUsrDoingAction(actionData)));
    // listen for new chat created
    socketClient?.on('new_chat_created', (newChat) => dispatch(addNewChat(newChat)));
  }, [currentUser, socketClient]);
  // listen for message to be mark as readed
  useEffect(() => {
    // TODO: refacotring mark message as readed
    // terminate if there is no message
    if (!messageToBeMarketAsReaded) return;
    // destructe
    const { msgId, senderId } = messageToBeMarketAsReaded!;
    // tell the server about readed message
    socketClient?.emit('message_readed', { msgId, senderId });
  }, [messageToBeMarketAsReaded]);
  // make socket connection
  useEffect(() => {
    // disconnect the web socket when usr logged out
    if (currentUser === undefined) socketClient?.disconnect();
    // terminate if usr is logged out
    if (!currentUser) return;
    // make socket io connection
    const socket = io(`${apiUrl}`, { query: { client_id: currentUser._id } });
    // set socket
    setSocket(socket);
  }, [currentUser]);
  // use effect
  useEffect(() => {
    socketClient?.on('message', (message: ChatMessage) => {
      // place last updated chat to the top
      dispatch(placeLastUpdatedChatToTheTop({ chatUsrId: message.sender._id }));
      // check for current route if it's chats
      if (pathname === '/chats') {
        dispatch(setNewIncomingMsg(message));
      }
      // inform the server that the message is delevered
      socketClient?.emit('message_delevered', {
        msgId: message._id,
        senderId: message.sender._id,
      });
      // termenate if no opened chat
      if (!openedChat) return;
      // check if the msg releated to current chat
      if (message.sender._id !== openedChat?._id && message.receiverId !== openedChat._id) return;
      dispatch(addMessageToChat(message));
      playReceiveMessageSound();
    });
    // usr_online_status
    socketClient?.on('usr_online_status', (data) => {
      // check if no chat is opened
      if (!openedChat) return;
      // check if the openedChat and the client doing the action of online status
      if (openedChat._id !== data.id) return;
      // all conditions passed
      dispatch(setChatUsrStatus(data.status));
    });
    // on new chat create
    socketClient?.on('chat_created', (chatId) => dispatch(setOpenedChat(chatId)));
    // receive message status
    socketClient?.on('message_status', (data: { msgId: string; status: MessageStatus }) => {
      dispatch(setMessageStatus(data));
      // check for message sent status
      if (data.status === MessageStatus.SENT) playSentMessageSound();
    });
  }, [currentUser, openedChat, socketClient]);
  // usr auth observer
  useEffect(() => {
    // redirect the usr to chats after logged in
    if (currentUser && apiResponse) push('/chats');
    // go back to home page when usr looged out
    if (currentUser === undefined) push('/');
  }, [currentUser, apiResponse]);
  // authentecate the user
  useEffect(() => {
    // get usr auth token from local storage
    const userToken = localStorage.getItem('access_token');
    // get usr chats
    dispatch(getUserChats(userToken) as unknown as AnyAction);
    // subscripe for push notifications and regester service worker
    enablePushNotification();
  }, []);
  return (
    <>
      <Head>
        <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
      <ChakraProvider theme={theme}>
        <SessionProvider>
          <Provider store={store}>
            <div className={styles.app}>
              {/* system notifications */}
              {systemNotifications && (
                <SystemNotifications data={{ err: systemNotifications.err, msg: systemNotifications.msg }} />
              )}
              {/* appHeader */}
              {currentUser !== null ? <AppHeader /> : ''}
              {currentUser === null ? '' : <Component {...pageProps} />}
              {currentUser === null ? <AppLogo /> : ''}
              <CreateChat />
              {/* CreateChatGroupMenu */}
              {isCreateChatGroupMenuOpen ? <CreateChatGroupMenu /> : ''}
            </div>
          </Provider>
        </SessionProvider>
      </ChakraProvider>
    </>
  );
}

export default wrapper.withRedux(App);
