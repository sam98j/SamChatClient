import React from 'react';
import styles from './styles.module.scss';
import { EditIcon, Icon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { changeNewChatScrStatus } from '@/redux/system.slice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import AppLogo from '../AppLogo';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import ChatUsrActions from '../ChatUsrActions/ChatUsrActions';
import ChatCalls from '../ChatCalls';
const AppHeader = () => {
  const { t } = useTranslation('appHeader');
  // path name
  const pathname = usePathname();
  // query params
  // get opened chat status
  const { openedChat, currentUsr, currentRoute, chatName } = useSelector((state: RootState) => {
    return {
      openedChat: state.chat.openedChat,
      chatUsrStatus: state.chat.chatUsrStatus,
      currentUsr: state.auth.currentUser,
      currentRoute: state.system.currentRoute,
      chatName: state.chat.currentChatPorfile?.name,
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
      <Box className={styles.back_arr_container}>
        {/* if user is not logged in  */}
        {Boolean(pathname !== '/chats') && Boolean(currentUsr) ? (
          <Link
            href={currentRoute !== 'chatProfile' ? '/chats' : `/chat?id=${params.get('id')}`}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon as={HiOutlineChevronLeft} color={'messenger.500'} boxSize={'6'} />
            <Text textColor={'messenger.500'}>{currentRoute !== 'chatProfile' ? t('prev_nav') : chatName}</Text>
          </Link>
        ) : (
          ''
        )}
        {/* show edit btn in the chats screen */}
        {pathname === '/chats' && currentUsr ? (
          <Text textColor={'messenger.500'} fontSize={'lg'}>
            {' '}
            {t('edit_btn')}{' '}
          </Text>
        ) : (
          ''
        )}
      </Box>
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
          <Link href={`/chat/profile?id=${params.get('id')}`}>
            <Avatar name='Hosam Alden' size={'sm'} src={openedChat.avatar} />
          </Link>
          {/* Chat Calls */}
          <ChatCalls />
        </Box>
      ) : (
        ''
      )}
      {/* login and sign up */}
      {currentUsr ? (
        ''
      ) : (
        <Box display={'flex'} gap={4}>
          <Link href='/signup'>
            <Button colorScheme='messenger' variant='solid'>
              {t('signup_link')}
            </Button>
          </Link>
          <Link href='/login?s=false'>
            <Button colorScheme='messenger' variant='outline'>
              {t('login_link')}
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default AppHeader;
