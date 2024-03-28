import { RootState } from '@/redux/store';
import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { IoCallOutline, IoNotificationsOffOutline, IoVideocamOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import styles from './styles.module.scss';
import useTranslation from 'next-translate/useTranslation';

const ChatCalls = () => {
  // localization method
  const { t } = useTranslation('chatProfile');
  // get current opened chat
  const { openedChat } = useSelector((state: RootState) => {
    return {
      openedChat: String(Boolean(state.chat.openedChat)),
    };
  });
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      gap={4}
      color={'gray'}
      is-chat-opened={openedChat}
      className={styles.chat_calls}
    >
      {/* voice call btn */}
      <Box className={styles.icon_container}>
        <IoCallOutline size={'1.4rem'} color='dodgerblue' />
        <Text className={styles.icon_text}>{t('chat_options.voice_call')}</Text>
      </Box>
      {/* video call btn */}
      <Box className={styles.icon_container}>
        <IoVideocamOutline size={'1.4rem'} color='dodgerblue' />
        <Text className={styles.icon_text}>{t('chat_options.video_call')}</Text>
      </Box>
      {/* mute */}
      <Box className={styles.icon_container}>
        <IoNotificationsOffOutline size={'1.3rem'} color='dodgerblue' />
        <Text className={styles.icon_text}>{t('chat_options.mute')}</Text>
      </Box>
    </Box>
  );
};

export default ChatCalls;
