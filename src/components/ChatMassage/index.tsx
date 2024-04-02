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
  // api url
  const apiHost = process.env.NEXT_PUBLIC_API_URL;
  // messages types
  const { TEXT, VOICENOTE, PHOTO, FILE, VIDEO } = MessagesTypes;
  // current app lang
  const { locale } = useRouter();
  // redux dispatch function
  const dispatch = useDispatch();
  // message data
  const { content, senderId, status, date, type, voiceNoteDuration: duration, fileName, fileSize } = messageData;
  // evaluate message content
  const [chatMessageContent] = useState(() => {
    // the it's text message or message's status is pending do not edit the content
    if (type === TEXT || status === null) return content;
    // otherwize
    return `${apiHost}${content}`;
  });
  // msg time
  const msgTime = getTime(date, TimeUnits.time);
  // fetch data from redux store
  const currentUsr = useSelector((state: RootState) => state.auth.currentUser);
  // check for the the message sender
  const [{ sendedByMe }] = useState({ sendedByMe: currentUsr === senderId });
  // component mount
  useEffect(() => {
    // check if the current usr is not the sender
    if (currentUsr === senderId) return;
    // check if message is readed
    if (status === MessageStatus.READED) return;
    // mark recived message as readed
    dispatch(setMessageStatus({ msgId: messageData._id, status: MessageStatus.READED }));
    //
    dispatch(setMessageToBeMarketAsReaded({ msgData: { msgId: messageData._id, senderId: senderId } }));
  }, []);
  return (
    <div
      className={styles.bubble}
      sended-by-me={`${String(sendedByMe)}`}
      message-status={String(status)}
      pref-lang={locale}
    >
      {/* chat text  */}
      <Text>
        {/* text message */}
        {type === TEXT ? content : ''}
        {/* voice message */}
        {type === VOICENOTE ? <VoiceMemoPlayer data={{ sendedByMe, src: chatMessageContent, duration }} /> : ''}
        {/* message type photo */}
        {type === PHOTO ? <ImageMsgViewer url={chatMessageContent} sendedByMe={sendedByMe} date={date} /> : ''}
        {/* message type file */}
        {type === FILE ? <FileMsgViewer url={chatMessageContent} name={fileName!} size={fileSize!} /> : ''}
        {/* message type video */}
        {type === VIDEO ? <VideoMsgPlayer url={chatMessageContent} date={date} sendedByMe={sendedByMe} /> : ''}
      </Text>
      {/* msg footer appear  in all messages types*/}
      <Box display={'flex'} justifyContent={'flex-end'} marginTop={'5px'}>
        {/* message time */}
        <Text className={styles.msg_time}>{msgTime}</Text>
        {/* when status is null show clock icon */}
        <MessageStatusIcon data={{ msgStatus: status!, senderId: senderId }} />
      </Box>
    </div>
  );
};

export default ChatMassage;
