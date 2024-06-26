import LanguageSwitcher from '@/components/LangSwitcher/LangSwitcher';
import { setCurrentRoute } from '@/redux/system.slice';
import { Box, Button, Text } from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const Settings = () => {
  const { t: tRoutes } = useTranslation('routesNames');
  const { t: tSettings } = useTranslation('settings');
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrentRoute(tRoutes('settings')));
  }, []);
  return (
    <>
      <Head>
        <title>Setting</title>
      </Head>
      <Box padding={'20px'} display={'flex'} flexDirection={'column'} gap={5}>
        <Box>
          <Text textColor={'gray'}>{tSettings('select_lang')}</Text>
          <Box bgColor={'gray.100'} padding={2} borderRadius={10}>
            <LanguageSwitcher path='settings' />
          </Box>
        </Box>
        <Box>
          <Text textColor={'gray'}>{tSettings('theme')}</Text>
          <Box bgColor={'gray.100'} padding={2} borderRadius={10}>
            <Button display={'block'} padding={0} fontWeight={'normal'}>
              {tSettings('theme__btn__light')}
            </Button>
            <Button display={'block'} padding={0} fontWeight={'normal'}>
              {tSettings('theme__btn__dark')}
            </Button>
            <Button display={'block'} padding={0} fontWeight={'normal'}>
              {tSettings('theme__btn__system')}
            </Button>
          </Box>
        </Box>
        <Box>
          <Text textColor={'gray'}>{tSettings('notifications')}</Text>
          <Box bgColor={'gray.100'} padding={2} borderRadius={10}>
            <Button display={'block'} padding={0} fontWeight={'normal'}>
              {tSettings('notification__btn__on')}
            </Button>
            <Button display={'block'} padding={0} fontWeight={'normal'}>
              {tSettings('notification__btn__off')}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Settings;
