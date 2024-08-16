import { ChatMember } from '@/redux/chats.slice';
import { Avatar, Box, Text } from '@chakra-ui/react';
import React, { FC } from 'react';

// Props
type Props = { member: ChatMember };

const GroupMember: FC<Props> = ({ member }) => {
  // ap url
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  return (
    <Box borderTop={'1px solid lightgray'} paddingTop={'10px'} display={'flex'} gap={'10px'}>
      {/* member Avatar */}
      <Avatar size={'md'} src={`${apiUrl}${member.avatar}`} />
      <Box>
        <Text>{member.name}</Text>
        <Text>last seen on 19, June, 2024</Text>
      </Box>
    </Box>
  );
};

export default GroupMember;
