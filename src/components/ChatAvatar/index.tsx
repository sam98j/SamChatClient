import { ChatTypes } from '@/redux/chats.slice';
import { RootState } from '@/redux/store';
import { Avatar } from '@chakra-ui/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ChatAvatar = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // redux data
  const { currentUser, openedChat } = useSelector((state: RootState) => {
    return {
      currentUser: state.auth.currentUser,
      openedChat: state.chat.openedChat,
    };
  });
  // chat avatar
  const [chatAvatar] = useState(() => {
    // get chat member
    const chatMember = openedChat?.members.filter((member) => member._id !== currentUser?._id)[0];
    // chatAvatarUrl
    const chatAvatarUrl = openedChat?.type === ChatTypes.GROUP ? openedChat.avatar : chatMember!.avatar;
    if (!chatAvatarUrl) return '';
    return `${apiUrl}${chatAvatarUrl}`;
  });
  // url params
  const params = useSearchParams();
  return (
    <>
      {/* chat usr avatar */}
      <Link href={`/chat_profile?id=${params.get('id')}`}>
        <Avatar name='Hosam Alden' size={'sm'} src={chatAvatar} />
      </Link>
    </>
  );
};

export default ChatAvatar;
