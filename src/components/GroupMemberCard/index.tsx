import { ChatMember } from '@/redux/chats.slice';
import { Avatar, Box, Text } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

// type Props = Pick<SingleChat, '_id' | 'avatar' | 'name'>;
type Props = {
  _id: string;
  avatar: string;
  name: string;
  setSelectedMembers: React.Dispatch<React.SetStateAction<ChatMember[]>>;
};

const GroupMemberCard: FC<Props> = ({ _id, avatar, name, setSelectedMembers }) => {
  // display check mark
  const [isSelected, setIsSelected] = useState(false);
  // clickHandler
  const clickHandler = () => setIsSelected(!isSelected);
  // back end api
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // is selected observer
  useEffect(() => {
    // check for if member is selected
    if (isSelected) return setSelectedMembers((prevState) => [...prevState!, { _id, avatar, name }]);
    // if it's not selected
    setSelectedMembers((prevState) => [...prevState!.filter((chatMember) => _id !== chatMember._id)]);
  }, [isSelected]);
  return (
    <Box display={'flex'} alignItems={'center'} gap={'10px'} color={'gray'} onClick={clickHandler}>
      {/* green check */}
      <Box position={'relative'}>
        <Avatar src={`${apiUrl}${avatar}`} />
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
        <Text>{name}</Text>
        <Text>{_id}</Text>
      </Box>
    </Box>
  );
};

export default GroupMemberCard;
