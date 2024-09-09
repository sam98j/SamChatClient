import { RootState } from '@/redux/store';
import { Box, Button, Input, InputGroup, Spinner } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import GroupMemberCard from '../GroupMemberCard';
import SearchInput from '../SearchInput/SearchInput';
import styles from './styles.module.scss';
import { ChatMember, ChatTypes, SingleChat, setOpenedChat } from '@/redux/chats.slice';
import { useDispatch } from 'react-redux';
import { addChatMembers, createChat } from '@/apis/chats.api';
import { AnyAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';
import { useRouter, useSearchParams } from 'next/navigation';
import { setSystemNotification, setVisablityOfCreateChatGroupMenu } from '@/redux/system.slice';
import useTranslation from 'next-translate/useTranslation';
import { CiCamera } from 'react-icons/ci';
import { Drawer, DrawerContent } from '../ui/drawer';

type GroupData = {
  name: string;
  avatar: File;
};

const CreateChatGroupMenu: FC<{ forCreation: boolean }> = ({ forCreation }) => {
  // use Router
  const { push } = useRouter();
  // translation method
  const { t } = useTranslation('createChatGroupMenu');
  // dispatch
  const dispatch = useDispatch();
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // params
  const params = useSearchParams();
  // get usr chat from redux store
  const { chats, addChatMembersRes } = useSelector((state: RootState) => {
    return {
      chats: state.chat.chats?.filter((chat) => chat.type === ChatTypes.INDIVISUAL),
      addChatMembersRes: state.chat.addChatMembersRes,
    };
  });
  // selected members
  const [selectedMembers, setSelectedMembers] = useState<ChatMember[]>([]);
  // groupName
  const [groupData, setGroupData] = useState<GroupData>(null!);
  // current usr id
  const loggedInUser = useSelector((state: RootState) => state.auth.currentUser) as ChatMember;
  // members selection complete
  const [isMemberSelectionDone, setIsMemberSelectionDone] = useState(false);
  // add members/continue btn
  const [addMembersAndContinueBtnText] = useState(() => {
    return forCreation ? t('completeChatCreationBtn') : t('add_members_btn');
  });
  // handleFormChange
  const handleFormChange = () => {};
  // inputChangeHandler
  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // get chat avatar
    if (e.target.files) return setGroupData({ ...groupData, avatar: e.target.files![0] });
    // get other data
    setGroupData({ ...groupData, [e.target.name]: e.target.value });
  };
  // continueHandler
  const continueHandler = () => {
    if (isMemberSelectionDone && groupData && forCreation) {
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
    // add group members
    if (!forCreation && selectedMembers.length !== 0) {
      // set isLoading
      setIsLoading(true);
      // add members
      dispatch(addChatMembers({ chatId: params.get('id')!, members: selectedMembers! }) as unknown as AnyAction);
    }
    // terminate if no members selected
    if (selectedMembers.length === 0) return;
    // make members selection state as done
    if (!isMemberSelectionDone) setIsMemberSelectionDone(true);
  };
  // addChatMemberRes observer
  useEffect(() => {
    // close modal if proccess is complelted
    if (!addChatMembersRes) return;
    dispatch(setVisablityOfCreateChatGroupMenu(false));
    // show system notification
    dispatch(setSystemNotification({ err: false, msg: t('membersAdditionStatus') }));
  }, [addChatMembersRes]);
  return (
    <Drawer open={true} dismissible={true} onClose={() => dispatch(setVisablityOfCreateChatGroupMenu(false))}>
      <DrawerContent className={`${styles.createChatGroupMenu} p-2 outline-none`}>
        <div className='mt-2'>
          <SearchInput data={{ handleFormChange, loadingState: false }} />
        </div>
        {/* group members */}
        <Box
          flexGrow={'1'}
          display={isMemberSelectionDone && forCreation ? 'none' : 'flex'}
          flexDirection={'column'}
          height={'60dvh'}
          gap={'10px'}
          marginTop={'10px'}
          overflowY={'scroll'}
        >
          {chats &&
            chats!.map((chat) => (
              <GroupMemberCard key={chat._id} chatMembers={chat.members} setSelectedMembers={setSelectedMembers} />
            ))}
          {/* TODO: refactor this group member card props */}
        </Box>
        {/* Group name and avatar */}
        <InputGroup display={isMemberSelectionDone && forCreation ? 'flex' : 'none'} alignItems={'center'} gap={'1.5rem'}>
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
        <Button
          colorScheme='blue'
          onClick={continueHandler}
          isDisabled={isLoading}
          paddingTop={'10px'}
          paddingBottom={'10px'}
        >
          {isLoading ? <Spinner /> : addMembersAndContinueBtnText}
        </Button>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateChatGroupMenu;
