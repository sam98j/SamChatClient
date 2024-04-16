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
            <Text
              textAlign={'center'}
              textColor={'blue.500'}
              marginTop={'30px'}
              bgColor={'blue.50'}
              rounded={'xl'}
              padding={'3px'}
              width={'fit-content'}
              marginLeft={'auto'}
              marginRight={'auto'}
            >
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
