/* eslint-disable react/no-unknown-property */
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
  // msg status pending icon
  const MsgCheckIcon = status === MessageStatus.SENT ? BiCheck : BiCheckDouble;
  // icon to display
  const IconToDisplay = status === null ? HiOutlineClock : MsgCheckIcon;
  return (
    <div
      msg-sended-by-me={String(currentUsr?._id === senderId)}
      message-status={status}
      className={styles.msg_status_icon}
    >
      <IconToDisplay className="text-gray-500" />
    </div>
  );
};

export default MessageStatusIcon;
