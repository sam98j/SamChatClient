import React from 'react';
import styles from './styles.module.scss';
import { Box } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ChatUserActions } from '@/interfaces/chat.interface';
import RecVoiceInd from '../RecVoiceInd';
import useTranslation from 'next-translate/useTranslation';
import { TimeUnits, getTime } from '@/utils/time';
import { useRouter } from 'next/router';

const ChatUsrActions = () => {
  // get local
  const { locale } = useRouter();
  // localization
  const { t } = useTranslation('appHeader');
  // get data from redux store
  const { isChatUsrDoingAction, chatUsrStatus, openedChat } = useSelector((state: RootState) => state.chat);
  return (
    <Box
      fontSize={'sm'}
      className={styles.chat_usr_actions}
      is-usr-doing-action={String(isChatUsrDoingAction.action !== null)}
      is-chat-opened={String(Boolean(openedChat))}
    >
      <span className={styles.actions}>
        {isChatUsrDoingAction.action === ChatUserActions.TYPEING ? t('usr_typing') : ''}
        {isChatUsrDoingAction.action === ChatUserActions.RECORDING_VOICE ? <RecVoiceInd /> : ''}
      </span>
      <div className={styles.online}>
        {/* display online if usr is online */}
        {chatUsrStatus === 'online' ? t('online') : ''}
        {/* display last seen if usr is not online */}
        {chatUsrStatus && chatUsrStatus !== 'online'
          ? `${t('last_seen')} ${getTime(chatUsrStatus, TimeUnits.fullTime, locale as never)}`
          : ''}
        {/* display group members */}
        {chatUsrStatus === null ? openedChat!.members.map((member) => member.name).toString() : ''}
      </div>
    </Box>
  );
};

export default ChatUsrActions;
