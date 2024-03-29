/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { ChatMessage, MessageStatus, MessagesTypes } from '@/interfaces/chat.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Box, Text } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { setMessageStatus, setMessageToBeMarketAsReaded } from '@/redux/chats.slice';
import { useRouter } from 'next/router';
import VoiceMemoPlayer from '../VoiceMemoPlayer';
import MessageStatusIcon from '../MessageStatus';
import { TimeUnits, getTime } from '@/utils/time';
import ImageMsgViewer from '../ImageMsgViewer';
import FileMsgViewer from '../FileMsgViewer';
import VideoMsgPlayer from '../VideoMsgPlayer';

const ChatMassage: React.FC<{ messageData: ChatMessage }> = ({ messageData }) => {
  // messages types
  const { TEXT, VOICENOTE, PHOTO, FILE, VIDEO } = MessagesTypes;
  // current app lang
  const { locale } = useRouter();
  // redux dispatch function
  const dispatch = useDispatch();
  const { content, senderId, status, date, type, voiceNoteDuration } = messageData;
  // msg time
  const msgTime = getTime(date, TimeUnits.time);
  // fetch data from redux store
  const currentUsr = useSelector((state: RootState) => state.auth.currentUser);
  // check for the the message sender
  const [{ sendedByme }] = useState({ sendedByme: currentUsr === senderId });
  // component mount
  useEffect(() => {
    // check if the current usr is not the sender
    if (currentUsr === senderId) return;
    // check if message is readed
    if (status === MessageStatus.READED) return;
    dispatch(setMessageStatus({ msgId: messageData._id, status: MessageStatus.READED }));
    dispatch(setMessageToBeMarketAsReaded({ msgData: { msgId: messageData._id, senderId: senderId } }));
  }, []);
  return (
    <div
      className={styles.bubble}
      sended-by-me={`${String(sendedByme)}`}
      message-status={String(status)}
      pref-lang={locale}
    >
      {/* chat text  */}
      <Text>
        {/* voice message */}
        {type === VOICENOTE ? (
          <VoiceMemoPlayer data={{ sendedByMe: sendedByme, src: content, voiceNoteDuration }} />
        ) : (
          ''
        )}
        {/* text message */}
        {type === TEXT ? content : ''}
        {/* message type photo */}
        {type === PHOTO ? <ImageMsgViewer msgUrl={content} sendedByMe={sendedByme} date={date} /> : ''}
        {/* message type file */}
        {type === FILE ? <FileMsgViewer fileContent={content} /> : ''}
        {/* message type video */}
        {type === VIDEO ? <VideoMsgPlayer url={content} date={date} sendedByMe={sendedByme} /> : ''}
      </Text>
      {/* msg footer appear  in all messages types*/}
      <Box display={'flex'} justifyContent={'flex-end'} marginTop={'5px'}>
        <Text color={'gray'} className={styles.msg_time} width={'fit-content'}>
          {msgTime}
        </Text>
        {/* when status is null show clock icon */}
        <MessageStatusIcon data={{ msgStatus: status!, senderId: senderId }} />
      </Box>
    </div>
  );
};

export default ChatMassage;
