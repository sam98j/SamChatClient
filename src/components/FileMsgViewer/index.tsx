import React from 'react';
import styles from './styles.module.scss';
import { Box, Text } from '@chakra-ui/react';
import { BsFilePdf } from 'react-icons/bs';

const FileMsgViewer: React.FC<{ fileContent: string }> = ({ fileContent }) => {
  typeof fileContent;
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
      {/* File Icon */}
      <BsFilePdf size={'1.5rem'} color='orange' />
      {/* file data */}
      <Box>
        <Text>اسعار القطاعي.pdf</Text>
        <Text>2 صفحة - 500 كيلو بايت - pdf</Text>
      </Box>
    </Box>
  );
};

export default FileMsgViewer;
