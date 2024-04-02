import React from 'react';
import styles from './styles.module.scss';
import { Box, Text } from '@chakra-ui/react';
import { BsFilePdf } from 'react-icons/bs';
import Link from 'next/link';

const FileMsgViewer: React.FC<{ name: string; size: string; url: string }> = (props) => {
  // destruct component props
  const { name, size, url } = props;
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
      <Link href={url} download={true}>
        {/* File Icon */}
        {/* file data */}
        <Box>
          <Text display={'flex'} alignItems={'center'}>
            <BsFilePdf size={'1.5rem'} color='orange' />
            {name} - <span>{size} كيلو بايت</span>
          </Text>
        </Box>
      </Link>
    </Box>
  );
};

export default FileMsgViewer;
