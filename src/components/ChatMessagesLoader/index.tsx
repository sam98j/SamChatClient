import { Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import ChatMassage from '../ChatMassage';
import { ChatMessage } from '@/interfaces/chat.interface';
import { MessagesGroubedByDate } from '@/utils/chat.util';

const ChatMessagesLoader: FC<{ messages: MessagesGroubedByDate }> = ({ messages }) => {
  //   console.log(messages);
  return (
    <>
      {messages.dates?.map((date, i) => {
        return (
          <>
            <Text textAlign={'center'} textColor={'gray'}>
              {date}
            </Text>
            {messages.messages[i].map((msg: ChatMessage) => (
              <ChatMassage messageData={msg} key={''} />
            ))}
          </>
        );
      })}
    </>
  );
};

export default ChatMessagesLoader;
