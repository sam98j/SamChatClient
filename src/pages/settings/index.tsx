import usePushNotifications from '@/Hooks/usePushNotifications';
import { deleteSubscription } from '@/apis/pushNotifications';
import LanguageSwitcher from '@/components/LangSwitcher/LangSwitcher';
import { setCurrentRoute } from '@/redux/system.slice';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Switch,
  Text,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const Settings = () => {
  // routes names localizations
  const { t: tRoutes } = useTranslation('routesNames');
  // setting localizations
  const { t: tSettings } = useTranslation('settings');
  // use Push Notificatins
  const { enablePushNotification } = usePushNotifications();
  // pref lang
  const { locale } = useRouter();
  // dispatch
  const dispatch = useDispatch();
  // switch component dir
  const switchComponentDir = locale === 'ar' ? 'rtl' : 'ltr';
  // is push notifications enabled
  const [notificationEnabled, setNotificationEnabled] = useState(
    Boolean(localStorage.getItem('push_notification_state')),
  );
  // handleNotificationSwitch
  const handleNotificationSwitch = () => {
    const notificationState = !notificationEnabled;
    // change notification state
    setNotificationEnabled(notificationState);
    // check for false
    if (notificationState === false) {
      // set local storage
      localStorage.removeItem('push_notification_state');
      // make notification disabled as a user pref
      localStorage.setItem('dis-notification', 'true');
      // delete notification sub
      deleteSubscription();
      // return
      return;
    }
    // make notification disabled as a user pref
    localStorage.removeItem('dis-notification');
    // enable push notificatinos
    enablePushNotification();
  };
  // component mount
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
          <Box bgColor={'blackAlpha.50'} padding={2} borderRadius={10}>
            <LanguageSwitcher path="settings" />
          </Box>
        </Box>
        <Box>
          <Text textColor={'gray'}>{tSettings('theme')}</Text>
          <Box bgColor={'blackAlpha.50'} padding={2} borderRadius={10}>
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
        {/* notification */}
        <Box>
          <Text textColor={'gray'}>{tSettings('notifications')}</Text>
          <Box bgColor={'blackAlpha.50'} padding={2} borderRadius={10}>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="email-alerts" mb="0" width={'full'}>
                {tSettings('push_notifications')}
              </FormLabel>
              <Switch
                id="email-alerts"
                colorScheme="green"
                isChecked={notificationEnabled}
                dir={switchComponentDir}
                onChange={handleNotificationSwitch}
              />
            </FormControl>
          </Box>
        </Box>
        {/* app ver */}
        <Text color={'gray'}>
          {tSettings('app_version')} {process.env.NEXT_PUBLIC_APP_VERSION}
        </Text>
      </Box>
    </>
  );
};

export default Settings;
