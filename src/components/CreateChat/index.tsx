/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from 'react';
import NewChatUser from '../NewChatUser';
import useUsersApi from './getUsrs.hook';
import { LoggedInUserData } from '@/redux/auth.slice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useDispatch } from 'react-redux';
import {
  changeNewChatScrStatus,
  setVisablityOfCreateChatGroupMenu,
} from '@/redux/system.slice';
import SearchInput from '../SearchInput/SearchInput';
import { Button, Text } from '@chakra-ui/react';
import { MdOutlineGroups2 } from 'react-icons/md';
import useTranslation from 'next-translate/useTranslation';
import { Drawer } from 'vaul';

// component state
type State = {
  searchqr: string;
  fetchedUsers: Omit<LoggedInUserData, 'email'>[];
  loading: boolean;
};

const CreateChat = () => {
  // translation method
  const { t } = useTranslation('createChatGroupMenu');
  // redux store dispatch function
  const dispatch = useDispatch();
  // redux store
  const isModalOpen = useSelector(
    (state: RootState) => state.system.isNewChatScreenOpen,
  );
  const { fetchUsers } = useUsersApi();
  // use effect
  // componet state
  const [state, setState] = useState<State>({
    searchqr: '',
    fetchedUsers: [],
    loading: false,
  });
  useEffect(() => {
    if (!isModalOpen) {
      document.body.style.margin = '0px';
      document.body.style.borderRadius = '0px';
      return;
    }
    document.body.style.setProperty('margin', '10px', 'important');
    document.body.style.borderRadius = '10px';
  }, [isModalOpen]);
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
    <Drawer.Root
      open={isModalOpen}
      onClose={() => dispatch(changeNewChatScrStatus(false))}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-gray-100 h-[95dvh] fixed bottom-0 left-0 right-0 outline-none rounded-t-xl">
          <div className="p-4 bg-white h-full rounded-t-xl flex flex-col gap-2">
            <Drawer.Handle />
            <SearchInput
              data={{ handleFormChange, loadingState: state.loading }}
            />
            <Button
              onClick={createGroupChatBtnHandler}
              width={'full'}
              borderRadius={'2xl'}
              colorScheme="blue"
              paddingTop={'10px'}
              paddingBottom={'10px'}
              display={'flex'}
              alignItems={'center'}
              gap={'10px'}
              justifyContent={'flex-start'}
            >
              <MdOutlineGroups2 size={'1.5rem'} color="white" />
              <Text>{t('createNewChatGroupBtn')}</Text>
            </Button>
            {/* user */}
            <div className="overflow-y-scroll">
              {state.fetchedUsers.map((usr) => (
                <NewChatUser
                  key={usr._id}
                  usr={usr}
                  searchqr={state.searchqr}
                />
              ))}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default CreateChat;
