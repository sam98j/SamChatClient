/* eslint-disable react/no-unknown-property */
import { Icon } from '@chakra-ui/icons';
import React from 'react';
import { BiCheck, BiCheckDouble } from 'react-icons/bi';
import { HiOutlineClock } from 'react-icons/hi';
import styles from './styles.module.scss';
import { MessageStatus } from '@/interfaces/chat.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

type MessageData = { status: MessageStatus; senderId: string };

const MessageStatusIcon: React.FC<MessageData> = ({ senderId, status }) => {
  // current usr
  const currentUsr = useSelector((state: RootState) => state.auth.currentUser);
  return (
    <div
      msg-sended-by-me={String(currentUsr?._id === senderId)}
      message-status={status}
      className={styles.msg_status_icon}
    >
      <Icon
        as={
          status === null
            ? HiOutlineClock
            : status === MessageStatus.SENT
              ? BiCheck
              : BiCheckDouble
        }
        boxSize={'5'}
        color={'gray'}
      />
    </div>
  );
};

export default MessageStatusIcon;
