import { Box } from '@chakra-ui/react';
import React from 'react';
import styles from './styles.module.scss';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { EditIcon } from '@chakra-ui/icons';
import { changeNewChatScrStatus } from '@/redux/system.slice';

const StartNewChatBtn = () => {
  // get path name
  const pathname = usePathname();
  // dispach
  const dispatch = useDispatch();
  //   get data from the redux store
  const { currentUsr, openedChat } = useSelector((state: RootState) => {
    return { openedChat: state.chat.openedChat, currentUsr: state.auth.currentUser };
  });
  return (
    <Box className={styles.create_new_chat_btn} is-chat-open={String(Boolean(openedChat))}>
      {pathname === '/chats' && !openedChat && currentUsr ? (
        <EditIcon
          boxSize={'6'}
          display={'block'}
          color={'messenger.500'}
          onClick={() => dispatch(changeNewChatScrStatus(true))}
        />
      ) : (
        ''
      )}
    </Box>
  );
};

export default StartNewChatBtn;
