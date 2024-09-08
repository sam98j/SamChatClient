import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, CloseButton } from '@chakra-ui/react';
import styles from './styles.module.scss';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSystemNotification } from '@/redux/system.slice';
import useTranslation from 'next-translate/useTranslation';

// props type
type SystemNotificationsProps = { data: { err: boolean; msg: string } | null };

const SystemNotifications: React.FC<SystemNotificationsProps> = ({ data }) => {
  // use translation
  const { t } = useTranslation('systemNotification');
  // dispatch function
  const dispatch = useDispatch();
  // hide notification after 5 secends
  const [hideNotificationTimeOut] = useState(setTimeout(() => hideNotificationHandler(), 5000));
  // hide notification handler
  const hideNotificationHandler = () => dispatch(setSystemNotification(null));
  // when component mount
  useEffect(() => {
    return function cleanUp() {
      clearTimeout(hideNotificationTimeOut);
    };
  }, []);
  return (
    <motion.div>
      <Alert status={data?.err ? 'error' : 'success'} className={styles.loginAlerts}>
        <AlertIcon />
        <Box width={'full'}>
          <AlertTitle>{data?.err ? t('notificationStatus.faild') : t('notificationStatus.succ')}</AlertTitle>
          <AlertDescription>{data?.msg}</AlertDescription>
        </Box>
        <CloseButton alignSelf='flex-start' position='relative' right={-1} top={-1} onClick={hideNotificationHandler} />
      </Alert>
    </motion.div>
  );
};

export default SystemNotifications;
