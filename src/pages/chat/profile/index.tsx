import { getChatProfile } from '@/apis/chats.api';
import ChatCalls from '@/components/ChatCalls';
import { RootState } from '@/redux/store';
import { setCurrentRoute } from '@/redux/system.slice';
import { Avatar, Box, Text } from '@chakra-ui/react';
import { AnyAction } from '@reduxjs/toolkit';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const ChatProfile = () => {
    // dispatch redux fun
    const dispatch = useDispatch();
    // get route name
    const {chatName, chatPorfile} = useSelector((state: RootState) => {
        return {
            chatName: state.system.currentRoute,
            chatPorfile: state.chat.currentChatPorfile
        };
    });
    // url query params
    const params = useSearchParams();
    // component did mount
    useEffect(() => {
        // set current route
        dispatch(setCurrentRoute('chatProfile'));
        // dispatch an async action
        dispatch(getChatProfile(params.get('id') as string) as unknown as AnyAction);
    }, []);
    return (
        <>
            <Head>
                <title>{chatName}</title>
            </Head>
            <Box
                height='calc(100% - 50px)'
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                padding={'30px'}
                gap={5}
            >
                <Avatar
                    src='https://xsgames.co/randomusers/avatar.php?g=female'
                    size={'2xl'}
                />
                {/* name */}
                <Text fontSize={'2xl'} fontWeight={'black'} margin={'0'} lineHeight={'0'}>
                    {chatPorfile?.name}
                </Text>
                <Text lineHeight={'0'} marginBottom={'10px'} textColor={'gray'}>{chatPorfile?.email}</Text>
                {/* chat calls */}
                <ChatCalls />
            </Box>
        </>
    );
};

export default ChatProfile;