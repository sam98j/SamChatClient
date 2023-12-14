import { Box, Button } from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import React from 'react';

const AuthLinks = () => {
  // localization method
  const { t } = useTranslation('appHeader');
  return (
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
  );
};

export default AuthLinks;
