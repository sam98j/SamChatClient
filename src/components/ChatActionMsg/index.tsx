/* eslint-disable react/no-unknown-property */
import { ChatMessage } from '@/interfaces/chat.interface';
import { RootState } from '@/redux/store';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import styles from './styles.module.scss';
import { Text } from '@chakra-ui/react';
// component props
type Props = Pick<ChatMessage, 'sender' | 'actionMsgType'> & {
  groupName: string;
};

const ChatActionMsg: FC<{ data: Props }> = ({ data }) => {
  // destruct props
  const { sender, actionMsgType, groupName } = data;
  // get opened chat name
  const { loggedInUserId, openedChat } = useSelector((state: RootState) => {
    return {
      loggedInUserId: state.auth.currentUser?._id,
      openedChat: state.chat.openedChat,
    };
  });
  // translate method
  const { t } = useTranslation('chatScreen');
  //   is action created by current user
  const isActionCreatedByCurrentUser = loggedInUserId === sender._id;
  // local
  const { locale } = useRouter();
  // taa letter in arabic langugae
  const taaLetterinArabicLang =
    locale === 'ar' && isActionCreatedByCurrentUser ? 'ت' : '';
  //   chat creation action text
  const chatCreationActionText = `${isActionCreatedByCurrentUser ? t('chatActionsMessages.creation.youPronoun') : sender.name} ${t('chatActionsMessages.creation.created')}${taaLetterinArabicLang} ${t('chatActionsMessages.creation.theGroup')} ' ${groupName} '`;
  return (
    <div
      id={styles.chat_action_message}
      className="flex justify-center my-3"
      is-chat-open={String(Boolean(openedChat))}
    >
      <Text className="shadow px-1 text-gray-500 text-xs rounded-md">
        {actionMsgType === 'CREATION' && chatCreationActionText}
      </Text>
    </div>
  );
};

export default ChatActionMsg;
