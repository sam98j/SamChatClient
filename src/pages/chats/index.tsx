import Head from 'next/head';
import styles from './home.module.scss';
import ChatCard from '@/components/ChatCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import noMassgeVector from '../../../assets/vectors/undraw_begin_chat_re_v0lw.svg';
import { Box, Text } from '@chakra-ui/react';
import BottomBar from '@/components/BottomBar';
import { useEffect } from 'react';
import { getUserChats } from '@/apis/chats.api';
import { useDispatch } from 'react-redux';
import { setCurrentRoute } from '@/redux/system.slice';
import React from 'react';
import { AnyAction } from '@reduxjs/toolkit';

export default function Home() {
    const dispatch = useDispatch();
    // get user chats
    const chats = useSelector((state: RootState) => state.chat.chats);
    useEffect(() => {
        dispatch(setCurrentRoute('Chats'));
        const userToken = localStorage.getItem('access_token');
        dispatch(getUserChats(userToken) as unknown as AnyAction);
    }, []);
    return (
        <>
            <Head>
                <title>SamChat</title>
                <meta
                    name='description'
                    content='Generated by create next app'
                />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <div className={styles.chats}>
                {/* render chats */}
                <Box>
                    {chats?.length === 0 ? (
                        <Box className={styles.imgContainer}>
                            <Image src={noMassgeVector} alt='no chats' />
                            <Text textColor={'gray'} fontSize={'1.5rem'}>
                                No Chats Yet!
                            </Text>
                        </Box>
                    ) : (
                        chats?.map((chat) => (
                            <ChatCard
                                key={String(Math.random())}
                                avataruri=''
                                chat={chat}
                            />
                        ))
                    )}
                </Box>
                <BottomBar />
            </div>
        </>
    );
}
