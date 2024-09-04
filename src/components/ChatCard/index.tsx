import React, { useEffect, useState } from 'react';
import { Avatar, Box, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { ChatCard, ChatTypes, setOpenedChat } from '@/redux/chats.slice';
import { useSelector } from 'react-redux';
import MessageStatusIcon from '../MessageStatus';
import { MessagesTypes } from '@/interfaces/chat.interface';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import styles from './styles.module.scss';
import ChatUsrActions from '../ChatUsrActions/ChatUsrActions';
import { useDispatch } from 'react-redux';
import { TimeUnits, getTime } from '@/utils/time';
import VoiceMemoPreview from '../VoiceMemoPreview';
import { shrinkMsg } from '@/utils/chat.util';
import ImagePreview from '../ImagePreview';
import VideoPreview from '../VideoPreview';
import FilePreview from '../FilePreview';

const ChatCard: React.FC<{ chat: ChatCard }> = ({ chat }) => {
  // base url
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // current loggedIn User
  const loggedInUser = useSelector((state: RootState) => state.auth.currentUser?._id);
  // chat avatar
  const [chatAvatar] = useState(() => {
    // get chat member
    const chatMember = chat.members.filter((member) => member._id !== loggedInUser)[0];
    // return
    return `${apiUrl}${chat.type === ChatTypes.GROUP ? chat.avatar : chatMember.avatar}`;
  });
  // chat name
  const [chatUser] = useState(() => chat.members.filter((member) => member._id !== loggedInUser)[0]);
  // chatName
  const [chatName] = useState(() => (chat.name ? chat.name : chatUser.name));
  // use dispatch
  const dispatch = useDispatch();
  // localize lang
  const { locale } = useRouter();
  // Messages types
  const { TEXT, VOICENOTE, PHOTO, VIDEO, FILE } = MessagesTypes;
  // get data from store
  const chatAction = useSelector((state: RootState) => state.chat.isChatUsrDoingAction);
  // is chat usr doing action
  const [isChatUsrDoingAction, setIsChatUserDoingAction] = useState('false');
  // listen for chat action
  useEffect(() => {
    // TODO: fix this massive rerender
    // check if no chat action
    if (!chatAction) return setIsChatUserDoingAction('false');
    // set isChatUserDoingAction
    setIsChatUserDoingAction(String(Boolean(chatAction.chatId === chat._id && chatAction.type)));
  }, [chatAction]);
  // handleCardClick
  const handleCardClick = () => dispatch(setOpenedChat(chat));
  // componet did mount
  return (
    <Link href={`/chat?id=${chat._id}`} onClick={handleCardClick}>
      <Box
        display={'flex'}
        gap={'3'}
        padding={'1.25rem 1.25rem 0rem 1.25rem'}
        pref-lang={locale}
        chat-usr-doing-actions={isChatUsrDoingAction}
        className={styles.chatCard}
      >
        {/* chat avatar */}
        <Avatar name='Hosam Alden' src={chatAvatar} />
        <Box flexGrow={'1'}>
          {/* chat usr name */}
          <Text fontSize={'md'} marginBottom={'5px'} textColor={'messenger.500'} fontFamily={'"Baloo Bhaijaan 2"'}>
            {chatName}
          </Text>
          {/* usr actions (usr typing, recording voice) */}
          <Text className={styles.chat_usr_actions}>
            <ChatUsrActions showAction={true} />
          </Text>
          {/* text message field */}
          <Text textColor={'gray.500'} display={'flex'} className={styles.msg_text}>
            {/* message status icons */}
            <MessageStatusIcon data={{ msgStatus: chat.lastMessage.status!, senderId: chat.lastMessage!.sender._id }} />
            {/* display text msg  */}
            {chat.lastMessage.type === TEXT ? shrinkMsg(chat.lastMessage.content) : ''}
            {/* display voice message details */}
            {chat.lastMessage.type === VOICENOTE ? <VoiceMemoPreview duration={chat.lastMessage.voiceNoteDuration} /> : ''}
            {/* photo message */}
            {chat.lastMessage.type === PHOTO ? <ImagePreview /> : ''}
            {/* video message preview*/}
            {chat.lastMessage.type === VIDEO ? <VideoPreview /> : ''}
            {/* file message preview */}
            {chat.lastMessage.type === FILE ? <FilePreview fileName={chat.lastMessage.fileName!} /> : ''}
          </Text>
        </Box>
        <Box>
          {/* loading msg time */}
          <Text width={'fit-content'} textColor={'gray'}>
            {getTime(chat.lastMessage.date, TimeUnits.time)}
          </Text>
          {/* un readed messages */}
          {chat.unReadedMsgs !== 0 ? (
            <Text
              bgColor={'messenger.500'}
              textColor={'white'}
              width={'1.25rem'}
              height={'1.25rem'}
              borderRadius={'50%'}
              textAlign={'center'}
              className={styles.un_readed_messages_count}
            >
              {chat.unReadedMsgs}
            </Text>
          ) : (
            ''
          )}
        </Box>
      </Box>
    </Link>
  );
};

export default ChatCard;
