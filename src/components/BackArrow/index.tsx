import { Box, Text } from '@chakra-ui/react';
import styles from './styles.module.scss';
import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Link from 'next/link';
import { Icon } from '@chakra-ui/icons';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

const BackArrow = () => {
  // current path
  const pathname = usePathname();
  // url params
  const params = useSearchParams();
  // localization function
  const { t } = useTranslation('appHeader');
  // current app lang
  const { locale } = useRouter();
  // get current usr
  const { currentUsr, currentRoute, chatName } = useSelector((state: RootState) => {
    return {
      currentUsr: state.auth.currentUser,
      currentRoute: state.system.currentRoute,
      chatName: state.chat.currentChatPorfile?.name.split(' ')[0],
    };
  });
  return (
    <Box className={styles.back_arr_container} pref-lang={locale}>
      {/* if user is not logged in  */}
      {Boolean(pathname !== '/chats') && Boolean(currentUsr) ? (
        <Link
          href={currentRoute !== 'chatProfile' ? '/chats' : `/chat?id=${params.get('id')}`}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
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
          {t('edit_btn')}
        </Text>
      ) : (
        ''
      )}
    </Box>
  );
};

export default BackArrow;
