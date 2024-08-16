import { RootState } from '@/redux/store';
import { Box, Button, Input, InputGroup } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import GroupMemberCard from '../GroupMemberCard';
import SearchInput from '../SearchInput/SearchInput';
import styles from './styles.module.scss';
import { ChatMember, ChatTypes, SingleChat, setOpenedChat } from '@/redux/chats.slice';
import { useDispatch } from 'react-redux';
import { createChatGroup } from '@/apis/chats.api';
import { AnyAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { setVisablityOfCreateChatGroupMenu } from '@/redux/system.slice';

const CreateChatGroupMenu = () => {
  // use Router
  const { push } = useRouter();
  // dispatch
  const dispatch = useDispatch();
  // selected members
  const [selectedMembers, setSelectedMembers] = useState<ChatMember[]>([]);
  // groupName
  const [groupName, setGroupName] = useState('');
  // current usr id
  const loggedInUser = useSelector((state: RootState) => state.auth.currentUser) as ChatMember;
  // members selection complete
  const [isMemberSelectionDone, setIsMemberSelectionDone] = useState(false);
  // continueHandler
  const continueHandler = () => {
    if (isMemberSelectionDone && groupName) {
      console.log('sending request');
      // create chat obj
      const createdChat: SingleChat = {
        _id: v4(),
        type: ChatTypes.GROUP,
        members: [loggedInUser, ...selectedMembers],
        name: groupName,
        avatar: '',
      };
      dispatch(createChatGroup(createdChat) as unknown as AnyAction);
      dispatch(setVisablityOfCreateChatGroupMenu(false));
      dispatch(setOpenedChat(createdChat));
      push('/chat?id=' + createdChat._id);
      return;
    }
    // terminate if no members selected
    if (selectedMembers.length === 0) return;
    if (!isMemberSelectionDone) setIsMemberSelectionDone(true);
  };
  // handleFormChange
  const handleFormChange = () => {};
  // inputChangeHandler
  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => setGroupName(e.target.value);
  // get usr chat from redux store
  const { chats } = useSelector((state: RootState) => state.chat);
  return (
    <Box
      height={'100%'}
      className={styles.createChatGroupMenuContainer}
      width={'full'}
      position={'absolute'}
      backgroundColor={'blackAlpha.500'}
      backdropFilter={'blur(10px)'}
      bottom={'0'}
      left={'0'}
    >
      <Box
        className={styles.createChatGroupMenu}
        borderTopRadius={'2xl'}
        width={'full'}
        padding={'1rem'}
        height={'90%'}
        backgroundColor={'white'}
        boxShadow={'0px 0px 5px lightgray'}
        position={'absolute'}
        bottom={'0'}
        display={'flex'}
        flexDirection={'column'}
        gap={'10px'}
        left={'0'}
      >
        {/* Search Input */}
        <SearchInput data={{ handleFormChange, loadingState: false }} />
        {/* group members */}
        <Box flexGrow={'1'} display={isMemberSelectionDone ? 'none' : 'flex'} flexDirection={'column'} gap={'10px'}>
          {chats &&
            chats.map((chat) => (
              <GroupMemberCard
                key={chat._id}
                _id={chat._id}
                name={chat.name}
                avatar={chat.avatar}
                setSelectedMembers={setSelectedMembers}
              />
            ))}
          {/* TODO: refactor this group member card props */}
        </Box>
        {/* Group name */}
        <InputGroup display={isMemberSelectionDone ? 'initial' : 'none'}>
          <Input placeholder='إختيار اسم المجموعة' ringColor={'green.400'} onChange={inputChangeHandler} />
        </InputGroup>
        {/* countine btn */}
        <Button colorScheme='green' onClick={continueHandler}>
          إستمرار
        </Button>
      </Box>
    </Box>
  );
};

export default CreateChatGroupMenu;
