import React from 'react';
import styles from './styles.module.scss';
import { Box } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import AppLogo from '../AppLogo';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import ChatCalls from '../ChatCalls';
import BackArrow from '../BackArrow';
import AuthLinks from '../AuthLinks';
import ChatAvatar from '../ChatAvatar';
import ScreenName from '../ScreenName';
import StartNewChatBtn from '../StartNewChatBtn';
const AppHeader = () => {
  // path name
  const pathname = usePathname();
  // query params
  // get opened chat status
  const { openedChat, currentUsr } = useSelector((state: RootState) => {
    return {
      openedChat: state.chat.openedChat,
      chatUsrStatus: state.chat.chatUsrStatus,
      currentUsr: state.auth.currentUser,
    };
  });
  // check for signup or login page if it open
  const isLoginOrSignUpOpen = pathname === '/login' || pathname === '/signup';
  // locale
  const { locale } = useRouter();
  return (
    <Box
      className={styles.appHeader}
      display={'flex'}
      alignItems={'center'}
      overflowY={'hidden'}
      gap={2}
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
      {currentUsr && openedChat ? <ChatAvatar avatar={openedChat.avatar} /> : ''}
      {currentUsr ? <ScreenName /> : ''}
      {/* add new chat btn */}
      <StartNewChatBtn />
      {/* voice call, avatar, video call */}
      {/* chat calls */}
      {currentUsr && openedChat ? <ChatCalls /> : ''}
      {/* hide login and sign up if there is no loggedin user */}
      {!currentUsr ? <AuthLinks /> : ''}
    </Box>
  );
};

export default AppHeader;
