import React from 'react';
import styles from './styles.module.scss';
import { EditIcon, Icon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { changeNewChatScrStatus } from '@/redux/system.slice';
import { useDispatch } from 'react-redux';
import { BsTelephone } from 'react-icons/bs';
import { IoVideocamOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import AppLogo from '../AppLogo';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
const AppHeader = () => {
    const { t } = useTranslation('appHeader');
    // path name
    const pathname = usePathname();
    // get opened chat status
    const {
        openedChat,
        isChatUsrTyping,
        chatUsrStatus,
        currentUsr,
        currentRoute,
    } = useSelector((state: RootState) => {
        return {
            openedChat: state.chat.openedChat,
            isChatUsrTyping: state.chat.isChatUsrTyping,
            chatUsrStatus: state.chat.chatUsrStatus,
            currentUsr: state.auth.currentUser,
            currentRoute: state.system.currentRoute,
        };
    });
    // Screen Header Name align
    const isChatOpen = openedChat ? 'true' : 'false';
    // check for signup or login page if it open
    const isLoginOrSignUpOpen = pathname === '/login' || pathname === '/signup';
    // locale
    const { locale } = useRouter();
    // dispach
    const dispatch = useDispatch();
    console.log(isLoginOrSignUpOpen);
    return (
        <Box
            className={styles.appHeader}
            display={'flex'}
            alignItems={'center'}
            overflowY={'hidden'}
            position={'relative'}
            is-chat-open={isChatOpen}
            is-usr-loggedin={String(isLoginOrSignUpOpen)}
            pref-lang={String(locale)}
        >
            {currentUsr ? '' : <AppLogo />}
            {/* back Arr */}
            <Box className={styles.back_arr_container}>
                {/* if user is not logged in  */}
                {Boolean(pathname !== '/chats') && Boolean(currentUsr) ? (
                    <Link
                        href={'/chats'}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Icon
                            as={HiOutlineChevronLeft}
                            color={'messenger.500'}
                            boxSize={'6'}
                        />
                        <Text textColor={'messenger.500'}>{t('prev_nav')}</Text>
                    </Link>
                ) : (
                    ''
                )}
                {pathname === '/chats' && currentUsr ? (
                    <Text textColor={'messenger.500'} fontSize={'lg'}>
                        {t('edit_btn')}
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
                    <Text className={styles.screen_name} fontSize={'lg'}>
                        {currentRoute}
                    </Text>
                    {/* is Chat User Typing */}
                    <Box
                        fontSize={'sm'}
                        className={styles.usr_status}
                        is-typing={String(isChatUsrTyping)}
                        is-online='false'
                    >
                        <span className={styles.typing}>typing ...</span>
                        <span className={styles.online}>{chatUsrStatus === 'online' ? t('online') : `${t('last_seen')} ${chatUsrStatus}`}</span>
                    </Box>
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
            {currentUsr && openedChat ? (
                <Box display={'flex'} alignItems={'center'} gap={5}>
                    <Avatar
                        name='Hosam Alden'
                        size={'sm'}
                        src='https://xsgames.co/randomusers/avatar.php?g=male'
                    ></Avatar>
                    <Icon
                        as={BsTelephone}
                        boxSize={'5'}
                        color={'messenger.500'}
                    />
                    <Icon
                        as={IoVideocamOutline}
                        boxSize={'6'}
                        color={'messenger.500'}
                    />
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
                            Sing Up
                        </Button>
                    </Link>
                    <Link href='/login?s=false'>
                        <Button colorScheme='messenger' variant='outline'>
                            Login
                        </Button>
                    </Link>
                </Box>
            )}
        </Box>
    );
};

export default AppHeader;
