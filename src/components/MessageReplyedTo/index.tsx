import { MessagesTypes } from '@/interfaces/chat.interface';
import { ResponseToMessageData } from '@/redux/chats.slice';
import React, { FC } from 'react';
import ImagePreview from '../ImagePreview';
import VideoPreview from '../VideoPreview';
import VoiceMemoPreview from '../VoiceMemoPreview';
import FilePreview from '../FilePreview';

type MsgData = ResponseToMessageData;

const MessageReplyedTo: FC<{ msgData: MsgData }> = ({ msgData }) => {
  // message types
  const { FILE, PHOTO, TEXT, VIDEO, VOICENOTE } = MessagesTypes;
  // message data
  const {
    content,
    fileName,
    sender,
    type,
    voiceNoteDuration: duration,
  } = msgData;
  return (
    <div className="bg-gray-50 p-1 rounded-[10px] text-sm">
      <h6 className="text-blue-400">{sender.name}</h6>
      <p className="text-gray-500">
        {/* text message */}
        {type === TEXT ? content : ''}
        {/* photo */}
        {type === PHOTO ? <ImagePreview /> : ''}
        {/* video  */}
        {type === VIDEO ? <VideoPreview /> : ''}
        {/* file */}
        {type === VOICENOTE ? <VoiceMemoPreview duration={duration} /> : ''}
        {/* file */}
        {type === FILE ? <FilePreview fileName={fileName!} /> : ''}
      </p>
    </div>
  );
};

export default MessageReplyedTo;
