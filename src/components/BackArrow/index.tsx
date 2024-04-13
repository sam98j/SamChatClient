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
  const { currentUsr, currentRoute } = useSelector((state: RootState) => {
    return {
      currentUsr: state.auth.currentUser,
      currentRoute: state.system.currentRoute,
      chatName: state.chat.currentChatPorfile?.name.split(' ')[0],
    };
  });
  // is Edit Btn Visable
  const isEditBtnVisable = pathname === '/chats' && currentUsr;
  // back Arrow href
  const backArrowHref = currentRoute !== 'chatProfile' ? '/chats' : `/chat?id=${params.get('id')}`;
  return (
    <Box className={styles.back_arr_container} pref-lang={locale}>
      {/* if user is not logged in  */}
      {pathname !== '/chats' && currentUsr ? (
        <Link href={backArrowHref} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Icon as={HiOutlineChevronLeft} color={'messenger.500'} boxSize={'6'} />
        </Link>
      ) : (
        ''
      )}
      {/* show edit btn in the chats screen */}
      {isEditBtnVisable ? (
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
