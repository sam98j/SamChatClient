/* eslint-disable react/no-unknown-property */
import React, { useState } from 'react';
import NewChatUser from '../NewChatUser';
import useUsersApi from './getUsrs.hook';
import { LoggedInUserData } from '@/redux/auth.slice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { changeNewChatScrStatus, setVisablityOfCreateChatGroupMenu } from '@/redux/system.slice';
import SearchInput from '../SearchInput/SearchInput';
import { Button, Text } from '@chakra-ui/react';
import { MdOutlineGroups2 } from 'react-icons/md';
import useTranslation from 'next-translate/useTranslation';
import { Drawer, DrawerContent } from '../ui/drawer';

const CreateChat = () => {
  // translation method
  const { t } = useTranslation('createChatGroupMenu');
  // redux store dispatch function
  const dispatch = useDispatch();
  // redux store
  const isModalOpen = useSelector((state: RootState) => state.system.isNewChatScreenOpen);
  const { fetchUsers } = useUsersApi();
  // use effect
  // componet state
  const [state, setState] = useState<{
    searchqr: string;
    fetchedUsers: Omit<LoggedInUserData, 'email'>[];
    loading: boolean;
  }>({
    searchqr: '',
    fetchedUsers: [],
    loading: false,
  });
  // handleFormChange
  const handleFormChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setState({
        ...state,
        loading: true,
      });
    }
    const fetchedUsers = await fetchUsers(e.target.value);
    setState({
      ...state,
      searchqr: e.target.value,
      fetchedUsers,
      loading: false,
    });
  };
  // createGroupChatBtnHandler
  const createGroupChatBtnHandler = () => {
    dispatch(setVisablityOfCreateChatGroupMenu(true));
    dispatch(changeNewChatScrStatus(false));
  };
  return (
    <Drawer open={isModalOpen} onClose={() => dispatch(changeNewChatScrStatus(false))}>
      <DrawerContent className='p-2 h-4/5 flex flex-col gap-3 outline-none'>
        <SearchInput data={{ handleFormChange, loadingState: state.loading }} />
        <Button
          onClick={createGroupChatBtnHandler}
          width={'full'}
          borderRadius={'2xl'}
          colorScheme='blue'
          paddingTop={'10px'}
          paddingBottom={'10px'}
          display={'flex'}
          alignItems={'center'}
          gap={'10px'}
          justifyContent={'flex-start'}
        >
          <MdOutlineGroups2 size={'1.5rem'} color='white' />
          <Text>{t('createNewChatGroupBtn')}</Text>
        </Button>
        {/* user */}
        <div className='overflow-y-scroll'>
          {state.fetchedUsers.map((usr) => (
            <NewChatUser key={usr._id} usr={usr} searchqr={state.searchqr} />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateChat;
