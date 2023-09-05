/* eslint-disable react/no-unknown-property */
import { Icon } from '@chakra-ui/icons';
import React from 'react';
import { BiCheck, BiCheckDouble } from 'react-icons/bi';
import { HiOutlineClock } from 'react-icons/hi';
import styles from './styles.module.scss';
import { MessageStatus } from '@/interfaces/chat.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';


const MessageStatusIcon: React.FC<{data: {msgStatus: MessageStatus, senderId: string}}> = ({data}) => {
    // current usr
    const currentUsr = useSelector((state: RootState) => state.auth.currentUser);
    console.log();
    return (
        <div
            msg-sended-by-me={String(currentUsr === data.senderId)}
            message-status={data.msgStatus}
            className={styles.msg_status_icon}
        >
            <Icon
                as={data.msgStatus === null ? HiOutlineClock : data.msgStatus === MessageStatus.SENT ? BiCheck : BiCheckDouble}
                boxSize={'5'}
                color={'gray'}
            />
        </div>
    );
};

export default MessageStatusIcon;