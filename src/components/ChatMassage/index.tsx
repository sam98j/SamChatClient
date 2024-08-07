/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { ChatMessage, MessageStatus, MessagesTypes } from '@/interfaces/chat.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Avatar, Box, Text } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { ChatTypes, setMessageStatus, setMessageToBeMarketAsReaded } from '@/redux/chats.slice';
import { useRouter } from 'next/router';
import VoiceMemoPlayer from '../VoiceMemoPlayer';
import MessageStatusIcon from '../MessageStatus';
import { TimeUnits, getTime } from '@/utils/time';
import ImageMsgViewer from '../ImageMsgViewer';
import FileMsgViewer from '../FileMsgViewer';
import VideoMsgPlayer from '../VideoMsgPlayer';

const ChatMassage: React.FC<{ messageData: ChatMessage }> = ({ messageData }) => {
  // back end api
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // messages types
  const { TEXT, VOICENOTE, PHOTO, FILE, VIDEO } = MessagesTypes;
  // current app lang
  const { locale } = useRouter();
  // redux dispatch function
  const dispatch = useDispatch();
  // message data
  const { content, sender, status, date, type, voiceNoteDuration, fileName, fileSize, _id } = messageData;
  // msg time
  const msgTime = getTime(date, TimeUnits.time);
  // fetch data from redux store
  const currentUsr = useSelector((state: RootState) => state.auth.currentUser);
  // current opend chat type
  const opendChatType = useSelector((state: RootState) => state.chat.openedChat?.type);
  // check for the the message sender
  const [sendedByMe] = useState(currentUsr?._id === sender._id);
  // component mount
  useEffect(() => {
    // check if the current usr is not the sender
    if (currentUsr?._id === sender._id) return;
    // check if message is readed
    if (status === MessageStatus.READED) return;
    // mark recived message as readed
    dispatch(setMessageStatus({ msgId: messageData._id, status: MessageStatus.READED }));
    //
    dispatch(setMessageToBeMarketAsReaded({ msgData: { msgId: messageData._id, senderId: sender._id } }));
  }, []);
  return (
    <div className={styles.messageContainer} pref-lang={locale}>
      {/* avatar */}
      {opendChatType === ChatTypes.GROUP && !sendedByMe ? <Avatar size={'sm'} src={`${apiUrl}${sender.avatar}`} /> : ''}
      {/* message bubble */}
      <div className={styles.bubble} sended-by-me={String(sendedByMe)} message-status={String(status)} pref-lang={locale}>
        {/* chat text  */}
        <Text>
          {/* chat sender name */}
          {opendChatType === ChatTypes.GROUP && !sendedByMe ? (
            <Text color={'gray'} fontSize={'sm'} borderBottom={'10px'}>
              {sender.name}
            </Text>
          ) : (
            ''
          )}
          {/* text message */}
          {type === TEXT ? content : ''}
          {/* voice message */}
          {type === VOICENOTE ? <VoiceMemoPlayer data={{ voiceNoteDuration, content, sender }} /> : ''}
          {/* message type photo */}
          {type === PHOTO ? <ImageMsgViewer data={{ sender, date, content, _id }} /> : ''}
          {/* message type file */}
          {type === FILE ? <FileMsgViewer data={{ fileName, fileSize, content }} /> : ''}
          {/* message type video */}
          {type === VIDEO ? <VideoMsgPlayer data={{ content, date, sender, _id }} /> : ''}
        </Text>
        {/* msg footer appear  in all messages types*/}
        <Box display={'flex'} justifyContent={'flex-end'} marginTop={'2px'} alignItems={'center'}>
          {/* message time */}
          <Text className={styles.msg_time} fontSize={'sm'}>
            {msgTime}
          </Text>
          {/* when status is null show clock icon */}
          <MessageStatusIcon data={{ msgStatus: status!, senderId: sender._id }} />
        </Box>
      </div>
    </div>
  );
};

export default ChatMassage;
