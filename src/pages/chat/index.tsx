/* eslint-disable no-constant-condition */
/* eslint-disable react/no-unknown-property */
import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import {Box, Spinner,Text,} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import NextImage from 'next/image';
import NoMessageDrow from '../../../assets/vectors/undraw_new_message_re_fp03.svg';
import { useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setOpenedChat} from '@/redux/chats.slice';
import { getChatMessages, getUsrOnlineStatus } from '@/apis/chats.api';
import ChatMassage from '@/components/ChatMassage';
import { setCurrentRoute } from '@/redux/system.slice';
import { AnyAction } from '@reduxjs/toolkit';
import ChatInput from '@/components/ChatInput/ChatInput';

const Chat = () => {
    // redux store dispatch function
    const dispatch = useDispatch();
    // use ref
    const chatRef = useRef<HTMLDivElement>(null);
    // data from the store
    const {chatMessages, chatName, chats } = useSelector((state: RootState) => {
        return {
            openedChat: state.chat.openedChat,
            chatMessages: state.chat.chatMessages,
            chatName: state.system.currentRoute,
            chats: state.chat.chats
        };
    }
    );
    const parmas = useSearchParams();
    // open chat state
    const [openedChat] = useState(() => chats?.filter(chat => chat.usrid === parmas.get('id') as string)[0]);
    // scroll to the bottom of the view
    useEffect(() => {chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);}, [chatMessages]);
    // component did mount life cicle hook
    useEffect(() => {
        // set opend chat
        dispatch(setOpenedChat({id: openedChat?.usrid as string, usrname: openedChat?.usrname as string}));
        // set route name
        dispatch(setCurrentRoute(openedChat!.usrname!));
        // get usr online status
        dispatch(getUsrOnlineStatus(parmas.get('id')!) as unknown as AnyAction);
        // check for chat opened
        if (openedChat) {dispatch(getChatMessages(parmas.get('id')!) as unknown as AnyAction);}
        // clean up when component unmount
        return function cleanUp() {dispatch(setOpenedChat(undefined));};
    }, []);
    // dummy messages
    return (
        <>
            <Head><title>{chatName}</title></Head>
            <div className={styles.chat} ref={chatRef}>
                {/* chat messages */}
                {chatMessages === null ? (
                    <Spinner className={styles.spinner} />
                ) : chatMessages!.length ? (
                    chatMessages!.map((msg) => (<ChatMassage messageData={msg} key={Math.random()}/> ))
                ) : (
                    <Box className={styles.imgContainer}>
                        <NextImage src={NoMessageDrow} alt='' />
                        <Text textColor={'gray'} fontSize={'1.5rem'}> No Messages Yet </Text>
                    </Box>
                )}
                {/* chat footer */}
                <ChatInput />
            </div>
        </>
    );
};

export default Chat;
