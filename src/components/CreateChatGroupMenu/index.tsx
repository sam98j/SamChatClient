import { RootState } from '@/redux/store';
import { Box, Button, Input, InputGroup } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import GroupMemberCard from '../GroupMemberCard';
import SearchInput from '../SearchInput/SearchInput';
import styles from './styles.module.scss';
import { ChatMember, ChatTypes, SingleChat, setOpenedChat } from '@/redux/chats.slice';
import { useDispatch } from 'react-redux';
import { createChat } from '@/apis/chats.api';
import { AnyAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { setVisablityOfCreateChatGroupMenu } from '@/redux/system.slice';
import useTranslation from 'next-translate/useTranslation';
import { CiCamera } from 'react-icons/ci';

type GroupData = {
  name: string;
  avatar: File;
};

const CreateChatGroupMenu = () => {
  // use Router
  const { push } = useRouter();
  // translation method
  const { t } = useTranslation('createChatGroupMenu');
  // dispatch
  const dispatch = useDispatch();
  // selected members
  const [selectedMembers, setSelectedMembers] = useState<ChatMember[]>([]);
  // groupName
  const [groupData, setGroupData] = useState<GroupData>(null!);
  // current usr id
  const loggedInUser = useSelector((state: RootState) => state.auth.currentUser) as ChatMember;
  // members selection complete
  const [isMemberSelectionDone, setIsMemberSelectionDone] = useState(false);
  // continueHandler
  const continueHandler = () => {
    if (isMemberSelectionDone && groupData) {
      // create chat obj
      const createdChat: SingleChat = {
        _id: v4(),
        type: ChatTypes.GROUP,
        members: [loggedInUser, ...selectedMembers],
        name: groupData.name,
        avatar: '',
      };
      dispatch(createChat({ chat: createdChat, avatar: groupData.avatar }) as unknown as AnyAction);
      dispatch(setVisablityOfCreateChatGroupMenu(false));
      dispatch(setOpenedChat(createdChat));
      push('/chat?id=' + createdChat._id);
      return;
    }
    // terminate if no members selected
    if (selectedMembers.length === 0) return;
    //
    if (!isMemberSelectionDone) setIsMemberSelectionDone(true);
  };
  // handleFormChange
  const handleFormChange = () => {};
  // inputChangeHandler
  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // get chat avatar
    if (e.target.files) return setGroupData({ ...groupData, avatar: e.target.files![0] });
    // get other data
    setGroupData({ ...groupData, [e.target.name]: e.target.value });
  };
  // get usr chat from redux store
  const { chats } = useSelector((state: RootState) => {
    return {
      chats: state.chat.chats?.filter((chat) => chat.type === ChatTypes.INDIVISUAL),
    };
  });
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
      {/* close modal */}
      <Box height={'full'} onClick={() => dispatch(setVisablityOfCreateChatGroupMenu(false))}></Box>
      {/* modal */}
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
              <GroupMemberCard key={chat._id} chatMembers={chat.members} setSelectedMembers={setSelectedMembers} />
            ))}
          {/* TODO: refactor this group member card props */}
        </Box>
        {/* Group name */}
        <InputGroup display={isMemberSelectionDone ? 'flex' : 'none'} alignItems={'center'} gap={'1.5rem'}>
          <Box
            backgroundColor={'gray.100'}
            borderRadius={'50%'}
            width={'fit-content'}
            padding={'10px'}
            position={'relative'}
          >
            <CiCamera size={'1.5rem'} />
            <Input
              type='file'
              name='avatar'
              accept='image/jpg,image/png'
              className={styles.choose_group_avatar}
              onChange={inputChangeHandler}
            />
          </Box>
          <Input placeholder={t('chooseGroupName')} ringColor={'green.400'} onChange={inputChangeHandler} name='name' />
        </InputGroup>
        {/* countine btn */}
        <Button colorScheme='green' onClick={continueHandler}>
          {t('completeChatCreationBtn')}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateChatGroupMenu;
