/* eslint-disable react/no-unknown-property */
import React, { useState } from 'react';
import styles from './styles.module.scss';
import { ChatMessage, MessagesTypes } from '@/interfaces/chat.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Avatar } from '@chakra-ui/react';
import {
  ChatTypes,
  ResponseToMessageData,
  setResponseToMessage,
} from '@/redux/chats.slice';
import { useRouter } from 'next/router';
import VoiceMemoPlayer from '../VoiceMemoPlayer';
import MessageStatusIcon from '../MessageStatus';
import { TimeUnits, getTime } from '@/utils/time';
import ImageMsgViewer from '../ImageMsgViewer';
import FileMsgViewer from '../FileMsgViewer';
import VideoMsgPlayer from '../VideoMsgPlayer';
import { useDispatch } from 'react-redux';
import MessageReplyedTo from '../MessageReplyedTo';
import { useSearchParams } from 'next/navigation';
import { ForwardIcon } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';

type MessageData = { messageData: ChatMessage };

const ChatMassage: React.FC<MessageData> = ({ messageData }) => {
  // back end api
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // local method
  const { t } = useTranslation('chatScreen');
  // messages types
  const { TEXT, VOICENOTE, PHOTO, FILE, VIDEO } = MessagesTypes;
  // current app lang
  const { locale } = useRouter();
  // get chat id
  const chatId = useSearchParams().get('id');
  // dispatch
  const dispatch = useDispatch();
  // redux dispatch function
  // message data
  const {
    content,
    sender,
    status,
    forwardedTo,
    date,
    type,
    voiceNoteDuration,
    fileName,
    fileSize,
    _id,
    receiverId,
    msgReplyedTo,
  } = messageData;
  // msg time
  const msgTime = getTime(date, TimeUnits.time);
  // fetch data from redux store
  const currentUsr = useSelector((state: RootState) => state.auth.currentUser);
  // current opend chat type
  const opendChatType = useSelector(
    (state: RootState) => state.chat.openedChat?.type,
  );
  const isForwordedToMe = receiverId !== chatId;
  // check for the the message sender
  const [sendedByMe] = useState(currentUsr?._id === sender._id);
  // doubleClickHandler
  const doubleClickHandler = () => {
    // response to message
    const responseToMessageData: ResponseToMessageData = {
      sender,
      voiceNoteDuration,
      _id,
      type,
      content,
      fileName,
    };
    // dispatch
    dispatch(setResponseToMessage(responseToMessageData));
  };
  // component mount
  return (
    <div
      className={styles.messageContainer}
      pref-lang={locale}
      onDoubleClick={doubleClickHandler}
    >
      {/* avatar */}
      {opendChatType === ChatTypes.GROUP && !sendedByMe && (
        <Avatar size={'sm'} src={`${apiUrl}${sender.avatar}`} />
      )}
      {/* message bubble */}
      <div
        className={styles.bubble}
        sended-by-me={String(sendedByMe)}
        message-status={String(status)}
        pref-lang={locale}
      >
        {/* chat text  */}
        <div>
          {/* forwarded message */}
          {isForwordedToMe && (
            <div className="flex items-center gap-2 text-gray-500 px-2">
              <ForwardIcon size={'1.25rem'} className={styles.forward_icon} />
              <span>{t('chatMessage.forwardedMessage')}</span>
            </div>
          )}
          {/* chat sender name */}
          {opendChatType === ChatTypes.GROUP && !sendedByMe && (
            <p className="text-gray-500">{sender.name}</p>
          )}
          {/* replyedToMsg */}
          {msgReplyedTo && <MessageReplyedTo msgData={msgReplyedTo} />}
          {/* text message */}
          {type === TEXT && content}
          {/* voice message */}
          {type === VOICENOTE && (
            <VoiceMemoPlayer data={{ voiceNoteDuration, content, sender }} />
          )}
          {/* message type photo */}
          {type === PHOTO && <ImageMsgViewer data={messageData} />}
          {/* message type file */}
          {type === FILE && (
            <FileMsgViewer data={{ fileName, fileSize, content }} />
          )}
          {/* message type video */}
          {type === VIDEO && (
            <VideoMsgPlayer data={{ content, date, sender, _id }} />
          )}
        </div>
        {/* msg footer appear  in all messages types*/}
        <div className="flex gap-1">
          {/* message time */}
          <span className="text-sm text-gray-500">{msgTime}</span>
          {/* when status is null show clock icon */}
          <MessageStatusIcon senderId={sender._id!} status={status!} />
        </div>
      </div>
    </div>
  );
};

export default ChatMassage;
