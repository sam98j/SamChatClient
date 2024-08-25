import { createChat } from '@/apis/chats.api';
import { LoggedInUserData } from '@/redux/auth.slice';
import { ChatTypes, SingleChat, setOpenedChat } from '@/redux/chats.slice';
import { RootState } from '@/redux/store';
import { changeNewChatScrStatus } from '@/redux/system.slice';
import { Avatar, Box, Heading, Text } from '@chakra-ui/react';
import { AnyAction } from '@reduxjs/toolkit';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { v4 } from 'uuid';

const NewChatUser: React.FC<{ usr: Omit<LoggedInUserData, 'email'>; searchqr: string }> = ({ usr, searchqr }) => {
  // api url
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // redux store dispatch function
  const dispatch = useDispatch();
  // current usr (loggedInUser)
  const { currentUser } = useSelector((state: RootState) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });
  // create chat
  const chat: SingleChat = {
    _id: v4(),
    type: ChatTypes.INDIVISUAL,
    avatar: '',
    members: [
      { _id: currentUser?._id!, avatar: currentUser?.avatar!, name: currentUser?.name! },
      { _id: usr._id, avatar: usr.avatar, name: usr.name },
    ],
    name: '',
  };
  // click handler
  const clickHandler = () => {
    // create new chat request
    dispatch(createChat(chat) as any as AnyAction);
    // set opended chat
    dispatch(setOpenedChat(chat));
  };
  return (
    <Link href={`/chat?id=${chat._id}`} onClick={clickHandler}>
      <Box display={'flex'} gap={5} marginTop={5} onClick={() => dispatch(changeNewChatScrStatus(false))}>
        <Avatar name='name' src={`${apiUrl}${usr.avatar}`} />
        <Box>
          <Heading fontSize={'md'}>{usr.name}</Heading>
          <Text textColor={'gray'} display={'flex'}>
            @ <Text textColor={'messenger.500'}>{searchqr}</Text>
            <Text>{usr.usrname?.split(searchqr)[1]}</Text>
          </Text>
        </Box>
      </Box>
    </Link>
  );
};

export default NewChatUser;
