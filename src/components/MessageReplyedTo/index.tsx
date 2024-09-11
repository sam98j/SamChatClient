import { ChatMessage } from '@/interfaces/chat.interface';
import React, { FC } from 'react';

type MsgData = Pick<ChatMessage, 'sender' | 'content'>;

const MessageReplyedTo: FC<{ msgData: MsgData }> = ({ msgData }) => {
  return (
    <div className="bg-gray-50 p-2 rounded-md">
      <h4 className="text-blue-400">{msgData.sender.name}</h4>
      <p className="text-gray-500">{msgData.content}</p>
    </div>
  );
};

export default MessageReplyedTo;
