import { ChatMember } from '@/redux/chats.slice';
import { RootState } from '@/redux/store';
import { Avatar, Box, Text } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

// type Props = Pick<SingleChat, '_id' | 'avatar' | 'name'>;
type Props = {
  chatMembers: ChatMember[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<ChatMember[]>>;
};

const GroupMemberCard: FC<Props> = ({ chatMembers, setSelectedMembers }) => {
  // display check mark
  const [isSelected, setIsSelected] = useState(false);
  // loggedInUser
  const loggedInUserId = useSelector((state: RootState) => state.auth.currentUser?._id);
  // chatUser
  const chatUser = chatMembers.filter((member) => member._id !== loggedInUserId)[0];
  // clickHandler
  const clickHandler = () => setIsSelected(!isSelected);
  // back end api
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // is selected observer
  useEffect(() => {
    // check for if member is selected
    if (isSelected) return setSelectedMembers((prevState) => [...prevState!, chatUser]);
    // if it's not selected
    setSelectedMembers((prevState) => [...prevState!.filter((chatMember) => chatUser._id !== chatMember._id)]);
  }, [isSelected]);
  return (
    <Box display={'flex'} alignItems={'center'} gap={'10px'} color={'gray'} onClick={clickHandler}>
      {/* green check */}
      <Box position={'relative'}>
        <Avatar src={`${apiUrl}${chatUser.avatar}`} />
        <Box
          position={'absolute'}
          display={isSelected ? 'initial' : 'none'}
          right={'0'}
          top={'50%'}
          backgroundColor={'white'}
          borderRadius={'full'}
          padding={'2px'}
        >
          <FaCheckCircle color='green' />
        </Box>
      </Box>
      <Box>
        <Text>{chatUser.name}</Text>
        <Text>{chatUser._id}</Text>
      </Box>
    </Box>
  );
};

export default GroupMemberCard;
