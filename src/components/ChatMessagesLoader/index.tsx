import { Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import ChatMassage from '../ChatMassage';
import { ChatMessage, MessagesTypes } from '@/interfaces/chat.interface';
import { MessagesGroubedByDate } from '@/utils/chat.util';
import ChatActionMsg from '../ChatActionMsg';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

// component props
type Props = { messages: MessagesGroubedByDate };

const ChatMessagesLoader: FC<Props> = ({ messages }) => {
  // get opened chat name
  const groupName = useSelector(
    (state: RootState) => state.chat.openedChat?.name,
  )!;
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
              key={i}
              rounded={'xl'}
              padding={'3px'}
              width={'fit-content'}
              marginLeft={'auto'}
              marginRight={'auto'}
            >
              {date}
            </Text>
            {messages.messages[i].map((msg: ChatMessage) => {
              // destruct
              const { sender, actionMsgType } = msg;
              // check for chat action message
              if (msg.type === MessagesTypes.ACTION) {
                return (
                  <ChatActionMsg
                    data={{ sender, actionMsgType, groupName }}
                    key={msg._id}
                  />
                );
              }
              // if it's a regular chat message
              return <ChatMassage messageData={msg} key={msg._id} />;
            })}
          </>
        );
      })}
    </>
  );
};

export default ChatMessagesLoader;
