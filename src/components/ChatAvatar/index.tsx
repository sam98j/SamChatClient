import { Avatar } from '@chakra-ui/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

const ChatAvatar: React.FC<{ avatar: string }> = ({ avatar }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // chat avatar
  const [avatar_url] = useState(() => {
    // check for avatar exist
    if (!avatar) return '';
    return `${apiUrl}${avatar}`;
  });
  // url params
  const params = useSearchParams();
  return (
    <>
      {/* chat usr avatar */}
      <Link href={`/chat_profile?id=${params.get('id')}`}>
        <Avatar name='Hosam Alden' size={'sm'} src={avatar_url} />
      </Link>
    </>
  );
};

export default ChatAvatar;
