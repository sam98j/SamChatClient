import { RootState, store, wrapper } from '@/redux/store';
import React, { useState } from 'react';
import '@/styles/globals.css';
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
import { ChatMessage, MessageStatus, MessagesTypes } from '@/interfaces/chat.interface';
import {
  addMessageToChat,
  setChatUsrStatus,
  setMessageStatus,
  setMessageToSent,
  setOpenedChat,
  setChatUsrDoingAction,
  addNewChat,
  placeLastUpdatedChatToTheTop,
} from '@/redux/chats.slice';
import { usePathname, useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { setNewIncomingMsg } from '@/redux/system.slice';
import useMultiChunksMsg from '@/Hooks/useMultiChunksMsg';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// chakra theme
const theme = extendTheme({ fonts: { body: '"Baloo Bhaijaan 2", cursive' } });

function App({ Component, pageProps }: AppProps) {
  // socket instance
  const [socketClient, setSocket] = useState<Socket | null>(null);
  // multichunk msg
  const { sendMuliChunksMsg } = useMultiChunksMsg(socketClient as Socket);
  // use path
  const pathname = usePathname();
  // router
  const { push } = useRouter();
  // search params
  const parmas = useSearchParams();
  // store dispatch func
  const dispatch = useDispatch();
  // auth state
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  // chat state
  const { openedChat, isCurrentUsrDoingAction, messageToBeMarketAsReaded, messageToSent, chatMessages } = useSelector(
    (state: RootState) => state.chat
  );
  // listen for multichunk msg
  useEffect(() => {
    // terminate if chat's messages not fetched yet
    if (!chatMessages) return;
    // msgs  to sent
    const messagesToSent = chatMessages.filter((msg) => msg.type !== MessagesTypes.TEXT && msg.status === null);
    // terminate if there is no message waiting for send
    if (!messagesToSent[0]) return;
    // send
    sendMuliChunksMsg(messagesToSent[0]);
  }, [chatMessages]);
  useEffect(() => {
    // termenate if user is not available
    if (!currentUser) return;
    if (!socketClient) return;
    // send msg
    if (!messageToSent) return;
    // regular msg
    socketClient?.emit('send_msg', messageToSent);
    // clear
    dispatch(setMessageToSent(null));
  }, [currentUser, messageToSent, socketClient]);
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
    // terminate if there is no message
    if (!messageToBeMarketAsReaded) return;
    // destructe
    const { msgId, senderId } = messageToBeMarketAsReaded!;
    // tell the server about readed message
    socketClient?.emit('message_readed', { msgId, senderId });
  }, [messageToBeMarketAsReaded]);
  // make socket connection
  useEffect(() => {
    if (currentUser === undefined) socketClient?.disconnect();
    if (!currentUser) return;
    const socket = io(`${apiUrl}`, { query: { client_id: currentUser } });
    // set socket
    setSocket(socket);
  }, [currentUser]);
  // use effect
  useEffect(() => {
    socketClient?.on('message', (message: ChatMessage) => {
      // place last updated chat to the top
      dispatch(placeLastUpdatedChatToTheTop({ chatUsrId: message.senderId }));
      // check for current route if it's chats
      if (pathname === '/chats') {
        dispatch(setNewIncomingMsg(message));
      }
      socketClient?.emit('message_delevered', {
        msgId: message._id,
        senderId: message.senderId,
      });
      // termenate if no opened chat
      if (!openedChat) return;
      // check if the msg releated to current chat
      if (message.senderId !== openedChat?.id) return;
      dispatch(addMessageToChat(message));
      playReceiveMessageSound();
    });
    // usr_online_status
    socketClient?.on('usr_online_status', (data) => {
      // check if no chat is opened
      if (!openedChat) return;
      // check if the openedChat and the client doing the action of online status
      if (openedChat.id !== data.id) return;
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
  useEffect(() => {
    // check for user authentecation state before make a
    if (currentUser) {
      push('/chats');
      return;
    }
    if (currentUser === undefined) {
      push('/');
      return;
    }
  }, [currentUser]);
  // authentecate the user
  useEffect(() => {
    const userToken = localStorage.getItem('access_token');
    dispatch(getUserChats(userToken) as unknown as AnyAction);
  }, []);
  return (
    <>
      <Head>
        <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
      <ChakraProvider theme={theme}>
        <Provider store={store}>
          <div style={{ height: '100dvh', overflow: 'hidden' }}>
            {currentUser !== null ? <AppHeader /> : ''}
            {currentUser === null ? '' : <Component {...pageProps} />}
            {currentUser === null ? <AppLogo /> : ''}
            <CreateChat />
          </div>
        </Provider>
      </ChakraProvider>
    </>
  );
}

export default wrapper.withRedux(App);
