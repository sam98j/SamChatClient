import React from 'react';
import styles from './styles.module.scss';
import { EditIcon } from '@chakra-ui/icons';
import { Avatar, Box, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { changeNewChatScrStatus } from '@/redux/system.slice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import AppLogo from '../AppLogo';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import ChatUsrActions from '../ChatUsrActions/ChatUsrActions';
import ChatCalls from '../ChatCalls';
import BackArrow from '../BackArrow';
import AuthLinks from '../AuthLinks';
const AppHeader = () => {
  // path name
  const pathname = usePathname();
  // query params
  // get opened chat status
  const { openedChat, currentUsr, currentRoute } = useSelector((state: RootState) => {
    return {
      openedChat: state.chat.openedChat,
      chatUsrStatus: state.chat.chatUsrStatus,
      currentUsr: state.auth.currentUser,
      currentRoute: state.system.currentRoute,
    };
  });
  // check for signup or login page if it open
  const isLoginOrSignUpOpen = pathname === '/login' || pathname === '/signup';
  // locale
  const { locale } = useRouter();
  // url params
  const params = useSearchParams();
  // dispach
  const dispatch = useDispatch();
  return (
    <Box
      className={styles.appHeader}
      display={'flex'}
      alignItems={'center'}
      overflowY={'hidden'}
      position={'relative'}
      is-chat-open={String(Boolean(openedChat))}
      is-usr-loggedin={String(isLoginOrSignUpOpen)}
      pref-lang={String(locale)}
    >
      {/* show app logo when user is not logged in */}
      {currentUsr ? '' : <AppLogo />}
      {/* back Arr */}
      <BackArrow />
      {/* Screen name */}
      {currentUsr ? (
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          gap={'20px'}
          flexGrow={1}
          className={styles.screen_name_container}
        >
          {/* Chat Name */}
          {/* do not display screen name when chat profile is opened */}
          <Text className={styles.screen_name} fontSize={'lg'}>
            {currentRoute !== 'chatProfile' ? currentRoute : ''}
          </Text>
          {/* show chatUsrAction only when chat is opened */}
          {openedChat ? <ChatUsrActions /> : ''}
        </Box>
      ) : (
        ''
      )}
      {/* add new chat btn */}
      <Box className={styles.create_new_chat_btn}>
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
      {/* voice call, avatar, video call */}
      {currentUsr && openedChat ? (
        <Box display={'flex'} alignItems={'center'} gap={5}>
          {/* chat usr avatar */}
          <Link href={`/chat_profile?id=${params.get('id')}`}>
            <Avatar name='Hosam Alden' size={'sm'} src={openedChat.avatar} />
          </Link>
          {/* Chat Calls */}
          <ChatCalls />
        </Box>
      ) : (
        ''
      )}
      {/* hide login and sign up if there is no loggedin user */}
      {!currentUsr ? <AuthLinks /> : ''}
    </Box>
  );
};

export default AppHeader;
