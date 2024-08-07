import React, { useState } from 'react';
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
  // get data from redux store
  const currentUserId = useSelector((state: RootState) => state.auth.currentUser?._id);
  // chat usr last seen
  const chatUsrLastSeen = `${t('last_seen')} ${getTime(chatUsrStatus!, TimeUnits.fullTime, locale as never)}`;
  // group members in case of chat group
  const [groupMembers] = useState(() => {
    if (!openedChat) return '';
    // you keyword
    const youKeyword = t('group_chatting.you_keyword');
    // check if group members is just tow
    if (openedChat?.members.length === 2) {
      return openedChat?.members
        .map((member) => {
          if (currentUserId === member._id) return t('group_chatting.you_keyword');
          return member.name;
        })
        .toString();
    }
    // in case of group members more than tow
    const groupMembersNames = openedChat?.members
      .filter((member) => member._id !== currentUserId)
      .map((member) => member.name);
    return `${youKeyword}, ${groupMembersNames[0]}, ${groupMembersNames.length - 1} ${t('group_chatting.others_keyword')}`;
  });
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
        {chatUsrStatus && chatUsrStatus !== 'online' ? chatUsrLastSeen : ''}
        {/* display group members */}
        {chatUsrStatus === null ? groupMembers : ''}
      </div>
    </Box>
  );
};

export default ChatUsrActions;
