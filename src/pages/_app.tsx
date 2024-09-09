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
import {
  playReceiveMessageSound,
  playSentMessageSound,
} from '@/utils/chat.util';
import {
  ChangeMessageStatusDTO,
  ChatMessage,
  MessageStatus,
} from '@/interfaces/chat.interface';
import {
  addMessageToChat,
  setChatUsrStatus,
  setMessageStatus,
  setOpenedChat,
  setChatUsrDoingAction,
  addNewChat,
  placeLastUpdatedChatToTheTop,
  setChatLastMessage,
  ChatCard,
  setChatUnReadedMessagesCount,
} from '@/redux/chats.slice';
import { usePathname } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import useChatMessagesSender from '@/Hooks/useChatMsgSender';
import SystemNotifications from '@/components/SystemNotifications/SystemNotifications';
import usePushNotifications from '@/Hooks/usePushNotifications';
import { SessionProvider } from 'next-auth/react';
import CreateChatGroupMenu from '@/components/CreateChatGroupMenu';

function App({ Component, ...pageProps }: AppProps) {
  // chakra theme
  const theme = extendTheme({
    fonts: { body: '"Baloo Bhaijaan 2", Arial, Helvetica, sans-serif,cursive' },
  });
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
  // store dispatch func
  const dispatch = useDispatch();
  // system state
  const { isCreateChatGroupMenuOpen } = useSelector(
    (state: RootState) => state.system,
  );
  // auth state
  const { apiResponse, currentUser } = useSelector(
    (state: RootState) => state.auth,
  );
  // system notifications
  const systemNotifications = useSelector(
    (state: RootState) => state.system.notifications,
  );
  // chat state
  const {
    openedChat,
    isCurrentUsrDoingAction,
    messageToBeMarketAsReaded,
    chatMessages,
  } = useSelector((state: RootState) => state.chat);
  // listen for multichunk msg
  useEffect(() => {
    // terminate if chat's messages not fetched yet
    if (!chatMessages) return;
    // msgs  to sent
    const messagesToSent = chatMessages.filter(
      (msg: ChatMessage) => msg.status === null,
    );
    // terminate if there is no message waiting for send
    if (!messagesToSent[0]) return;
    // send
    sendChatMessage(messagesToSent[0]);
  }, [chatMessages]);
  // listen to isCurrentUsrDoingAction
  useEffect(() => {
    // chatusr_start_typing
    socketClient?.emit('chatusr_typing_status', isCurrentUsrDoingAction);
  }, [isCurrentUsrDoingAction]);
  // listen for chat user doing action
  useEffect(() => {
    // check for usr and socket
    if (!socketClient) return;
    // listen for chat usr doing action
    socketClient?.on('chatusr_typing_status', (actionData) =>
      dispatch(setChatUsrDoingAction(actionData)),
    );
    // listen for new chat created
    socketClient?.on('new_chat_created', (newChat: ChatCard) => {
      // add the new chat to the user's chats list
      dispatch(addNewChat(newChat));
      // change message status dto
      const changeMessageStatusData: ChangeMessageStatusDTO = {
        msgIDs: [newChat.lastMessage._id],
        msgStatus: MessageStatus.DELEVERED,
        chatId: newChat._id,
        senderIDs: [newChat.lastMessage.sender._id],
      };
      // emit the received chat's message as delevered
      socketClient.emit('message_status_changed', changeMessageStatusData);
    });
  }, [socketClient]);
  // listen for message to be mark as readed
  useEffect(() => {
    // terminate if there is no message
    if (!messageToBeMarketAsReaded) return;
    // tell the server about readed message
    socketClient?.emit('message_status_changed', messageToBeMarketAsReaded);
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
    // usr_online_status
    socketClient?.on('usr_online_status', (data) => {
      // check if no chat is opened
      if (!openedChat) return;
      // chat Usr
      const chatUser = openedChat.members.filter(
        (member) => member._id !== currentUser?._id,
      )[0];
      // check if the openedChat and the client doing the action of online status
      if (chatUser._id !== data.id) return;
      // all conditions passed
      dispatch(setChatUsrStatus(data.status));
    });
    // on new chat create
    socketClient?.on('chat_created', (chatId) =>
      dispatch(setOpenedChat(chatId)),
    );
    // clear listener
    socketClient?.removeAllListeners('message_status_changed');
    // receive message status
    socketClient?.on(
      'message_status_changed',
      (data: ChangeMessageStatusDTO) => {
        console.log(data.msgStatus);
        // check for message sent status
        if (data.msgStatus === MessageStatus.SENT) playSentMessageSound();
        // set message status
        dispatch(setMessageStatus(data));
      },
    );
  }, [socketClient, openedChat, currentUser]);
  // listen for incoming messages
  useEffect(() => {
    // remove all message listener
    socketClient?.removeAllListeners('message');
    // listen for new message
    socketClient?.on('message', (message: ChatMessage) => {
      // place last updated chat to the top
      dispatch(placeLastUpdatedChatToTheTop({ chatId: message.receiverId }));
      // set chat's last message
      dispatch(
        setChatLastMessage({ msg: message, currentUserId: currentUser!._id }),
      );
      // mark received message as delevered if there is no opened chat
      if (!openedChat || openedChat._id !== message.receiverId) {
        // change message status dto
        const data: ChangeMessageStatusDTO = {
          msgIDs: [message._id],
          senderIDs: [message.sender._id],
          chatId: message.receiverId,
          msgStatus: MessageStatus.DELEVERED,
        };
        // inform the server that the message is delevered
        socketClient?.emit('message_status_changed', data);
        dispatch(setChatUnReadedMessagesCount({ msg: message }));
        return;
      }
      // chatUser
      const chatUserId = openedChat!.members.filter(
        (member) => member._id !== currentUser!._id,
      )[0]._id;
      // check if the msg releated to current chat
      if (
        message.sender._id !== chatUserId &&
        message.receiverId !== chatUserId
      )
        return;
      // add receved message to chat messages
      dispatch(addMessageToChat(message));
      // play recive message sound
      playReceiveMessageSound();
    });
  }, [socketClient, openedChat]);
  // usr auth observer
  useEffect(() => {
    // redirect the usr to chats after logged in
    if (currentUser && apiResponse) push('/chats');
    // redirect usr to chats if he is loggedin and hit /
    if (currentUser && pathname === '/') push('/chats');
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
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <ChakraProvider theme={theme}>
        <SessionProvider>
          <Provider store={store}>
            <div className={styles.app}>
              {/* system notifications */}
              {systemNotifications && (
                <SystemNotifications
                  data={{
                    err: systemNotifications.err,
                    msg: systemNotifications.msg,
                  }}
                />
              )}
              {/* appHeader */}
              {currentUser !== null ? <AppHeader /> : ''}
              {currentUser === null ? '' : <Component {...pageProps} />}
              {currentUser === null ? <AppLogo /> : ''}
              <CreateChat />
              {/* CreateChatGroupMenu */}
              {isCreateChatGroupMenuOpen ? (
                <CreateChatGroupMenu forCreation={Boolean(!openedChat)} />
              ) : (
                ''
              )}
            </div>
          </Provider>
        </SessionProvider>
      </ChakraProvider>
    </>
  );
}

export default wrapper.withRedux(App);
