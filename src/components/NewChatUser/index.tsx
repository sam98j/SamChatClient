import { LoggedInUserData } from '@/redux/auth.slice';
import { ChatTypes, SingleChat, setOpenedChat } from '@/redux/chats.slice';
import { changeNewChatScrStatus } from '@/redux/system.slice';
import { Avatar, Box, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { useDispatch } from 'react-redux';

const NewChatUser: React.FC<{
  usr: Omit<LoggedInUserData, 'email'>;
  searchqr: string;
}> = ({ usr, searchqr }) => {
  // api url
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // redux store dispatch function
  const dispatch = useDispatch();
  // create chat
  const chat: SingleChat = {
    _id: usr._id,
    type: ChatTypes.INDIVISUAL,
    avatar: usr.avatar,
    members: [],
    name: usr.name,
  };
  return (
    <Link href={`/chat?id=${usr._id}`} onClick={() => dispatch(setOpenedChat(chat))}>
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
