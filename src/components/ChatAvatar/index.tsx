import { Avatar } from '@chakra-ui/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';

const ChatAvatar: React.FC<{ avatar: string }> = ({ avatar }) => {
  // url params
  const params = useSearchParams();
  return (
    <>
      {/* chat usr avatar */}
      <Link href={`/chat_profile?id=${params.get('id')}`}>
        <Avatar name='Hosam Alden' size={'sm'} src={avatar} />
      </Link>
    </>
  );
};

export default ChatAvatar;
