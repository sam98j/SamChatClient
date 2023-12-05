import { LoggedInUserData } from '@/redux/auth.slice';
import { setOpenedChat } from '@/redux/chats.slice';
import { changeNewChatScrStatus } from '@/redux/system.slice';
import { Avatar, Box, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { useDispatch } from 'react-redux';

const NewChatUser: React.FC<{
  usr: Omit<LoggedInUserData, 'email'>;
  searchqr: string;
}> = ({ usr, searchqr }) => {
  // redux store dispatch function
  const dispatch = useDispatch();
  return (
    <Link
      href={`/chat?id=${usr._id}`}
      onClick={() =>
        dispatch(setOpenedChat({ id: usr._id!, usrname: usr.name! }))
      }
    >
      <Box
        display={'flex'}
        gap={5}
        marginTop={5}
        onClick={() => dispatch(changeNewChatScrStatus(false))}
      >
        <Avatar name='name' src={usr.avatar} />
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
