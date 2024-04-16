import React, { useState } from 'react';
import styles from './styles.module.scss';
import { Box, Text } from '@chakra-ui/react';
import { BsFilePdf } from 'react-icons/bs';
import Link from 'next/link';
import { ChatMessage } from '@/interfaces/chat.interface';

// Props
type Props = Pick<ChatMessage, 'content' | 'fileName' | 'fileSize'>;

const FileMsgViewer: React.FC<{ data: Props }> = ({ data }) => {
  // api url
  const apiHost = process.env.NEXT_PUBLIC_API_URL;
  // destruct component props
  const { content, fileName, fileSize } = data;
  // file url
  const [fileUrl] = useState(() => {
    // check if content contain http
    if (content.includes('data:')) return content;
    // otherwize
    return `${apiHost}${content}`;
  });
  return (
    <Box
      className={styles.fileMsgViewer}
      display={'flex'}
      alignItems={'center'}
      gap={2}
      bgColor={'whiteAlpha.600'}
      padding={'5px'}
      borderRadius={'5px'}
    >
      <Link href={fileUrl} download={true}>
        {/* File Icon */}
        {/* file data */}
        <Box>
          <Text display={'flex'} alignItems={'center'}>
            <BsFilePdf size={'1.5rem'} color='orange' />
            {fileName} - <span>{fileSize} كيلو بايت</span>
          </Text>
        </Box>
      </Link>
    </Box>
  );
};

export default FileMsgViewer;
