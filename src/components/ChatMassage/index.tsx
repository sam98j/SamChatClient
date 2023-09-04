/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { ChatMessage, MessageStatus } from '@/interfaces/chat.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Icon } from '@chakra-ui/icons';
import { BiCheck, BiCheckDouble } from 'react-icons/bi';
import { Box, Text } from '@chakra-ui/react';
import { HiOutlineClock } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { setMessageStatus } from '@/redux/chats.slice';
import { useRouter } from 'next/router';
import VoiceMemoPlayer from '../VoiceMemoPlayer';

const ChatMassage: React.FC<{
    messageData: ChatMessage;
    markMsgAsReaded: (msgId: string, senderId: string) => void;
}> = ({ messageData, markMsgAsReaded }) => {
    const { locale } = useRouter();
    // redux dispatch function
    const dispatch = useDispatch();
    const { text, senderId, status, date, isItTextMsg, voiceNoteDuration } = messageData;
    // msg time
    let msgTime: Date | string = new Date(date);
    msgTime = `${msgTime.getHours()}:${msgTime.getMinutes()}`;
    // fetch data from redux store
    const currentUsr = useSelector(
        (state: RootState) => state.auth.currentUser
    );
    // get data from redux store
    const currentUsrId = useSelector(
        (state: RootState) => state.auth.currentUser
    );
    const [state] = useState({
        sendedByme: currentUsrId === senderId,
    });
    // component mount
    useEffect(() => {
        // check if the current usr is not the sender
        if (currentUsr !== senderId) {
            dispatch(
                setMessageStatus({
                    msgId: messageData._id,
                    status: MessageStatus.READED,
                })
            );
            // check if message is readed
            if (status === MessageStatus.READED) return;
            markMsgAsReaded(messageData._id, senderId);
        }
    }, []);
    return (
        <div
            className={styles.bubble}
            sended-by-me={`${String(state.sendedByme)}`}
            message-status={String(status)}
            pref-lang={locale}
        >
            {/* chat text  */}
            <Text>{isItTextMsg ? text : <VoiceMemoPlayer data={{sendedByMe: state.sendedByme, src: text, voiceNoteDuration}} />}</Text>
            {/* msg footer */}
            <Box display={'flex'} justifyContent={'flex-end'}>
                <Text color={'gray'} className={styles.msg_time} width={'fit-content'}>
                    {msgTime}
                </Text>
                {/* when status is null show clock icon */}
                <Icon
                    as={status === null ? HiOutlineClock : status === MessageStatus.SENT ? BiCheck : BiCheckDouble}
                    boxSize={'5'}
                    color={'gray'}
                    className={styles.msg_status_icon}
                />
            </Box>
        </div>
    );
};

export default ChatMassage;
