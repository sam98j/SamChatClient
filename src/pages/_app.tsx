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
import {extendTheme} from '@chakra-ui/react';
// import { useSocketIo } from '@/utils/hooks/sockets';
import { playReceiveMessageSound, playSentMessageSound } from '@/utils/chat.util';
import { ChatMessage, MessageStatus } from '@/interfaces/chat.interface';
import { addMessageToChat, setChatUsrStatus, setChatUsrTyping, setMessageStatus, setOpenedChat } from '@/redux/chats.slice';
import { useSearchParams } from 'next/navigation';
import { io , Socket} from 'socket.io-client';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// chakra theme
const theme = extendTheme({fonts: {body: '"Baloo Bhaijaan 2", cursive'}});

function App({ Component, pageProps }: AppProps) {
    const {push} = useRouter();
    // useSocketIo();
    const user = useSelector((state: RootState) => state.auth.currentUser);
    // store dispatch func
    const dispatch = useDispatch();
    // search params
    const parmas = useSearchParams();
    // auth state
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    // chat state
    const {openedChat, isCurrentUsrTyping, chatMessages} = useSelector((state: RootState) => state.chat);
    // socket instance
    const [socketClient, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        // termenate if user is not available
        if(!currentUser) return;
        // // open websocket connection
        const socket = io(`${apiUrl}`, {
            query: { client_id: currentUser },
        });
        // set socket
        setSocket(socket);
        // chatusr_start_typing
        socket?.on('chatusr_typing_status', (status) => dispatch(setChatUsrTyping(status)));
        socket?.emit('chatusr_typing_status', {chatUsrId: parmas.get('id'), status: isCurrentUsrTyping,});
        // receive msg
        socket?.on('message', (message: ChatMessage) => {
            socket.emit('message_delevered', {msgId: message._id, senderId: message.senderId,});
            // check if the msg releated to current chat
            if (message.senderId !== openedChat?.id) {return;}
            dispatch(addMessageToChat(message));
            playReceiveMessageSound();
        });
        // check for chat opend
  
        // usr_online_status
        socket?.on('usr_online_status', (data) => {
            if (parmas.get('id') === data.id) {
                dispatch(setChatUsrStatus(data.status));
            }
        });
        // on new chat create
        socket?.on('chat_created', (chatId) => dispatch(setOpenedChat(chatId)));
        // receive message status
        // socket?.on(
        //     'message_status',
        //     (data: { msgId: string; status: MessageStatus }) => {

        //         dispatch(setMessageStatus(data));
        //         // check for message sent status
        //         if (data.status === MessageStatus.SENT) {
        //             playSentMessageSound();
        //         }
        //     }
        // );
    }, [currentUser, isCurrentUsrTyping]);
    useEffect(() => {
        if(chatMessages?.length) {
            socketClient?.emit('send_msg', chatMessages[chatMessages.length - 1]);
        }
    }, [chatMessages]);
    useEffect(() => {
        // check for user authentecation state before make a 
        if (user) {push('/chats');return;}
        if (user === undefined) {push('/');return;}
    }, [user]);
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
                    <div
                        style={{
                            height: '100dvh',
                            overflow: 'hidden',
                        }}
                    >
                        {user !== null ? <AppHeader /> : ''}
                        {user === null ? '' : <Component {...pageProps} />}
                        {user === null ? <AppLogo /> : ''}
                        <CreateChat />
                    </div>
                </Provider>
            </ChakraProvider>
        </>
    );
}

export default wrapper.withRedux(App);
