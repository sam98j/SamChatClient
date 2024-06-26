import { Box, Spinner, Text } from '@chakra-ui/react';
import React from 'react';
import logoSVG from '../../../assets/vectors/chat-round-check-svgrepo-com.svg';
import Image from 'next/image';
import styles from './styles.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import useTranslation from 'next-translate/useTranslation';

const AppLogo = () => {
  const { t } = useTranslation('appLogo');
  const user = useSelector((state: RootState) => state.auth.currentUser);
  return (
    <Box
      className={styles.logo_container}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      gap={5}
      is-app-loading={String(user === null)}
    >
      <Box display={'flex'} alignItems={'center'} gap={2}>
        {/* app logo */}
        <Image alt='logo' src={logoSVG} className={styles.img} />
        {/* app name */}
        <Text fontSize={'lg'} fontWeight={'black'}>
          {/* show app name only if usr data is not fetched yet */}
          {user === null ? t('appName') : ''}
        </Text>
      </Box>
      {/* show spinner loading if user data is not fetched yet */}
      {user === null ? <Spinner color='blue' display={'block'} alignSelf={'center'} /> : ''}
    </Box>
  );
};

export default AppLogo;
