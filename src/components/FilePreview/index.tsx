import { Box, Text } from '@chakra-ui/react';
// import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { BsFileEarmark } from 'react-icons/bs';

const FilePreview: React.FC<{ fileName: string }> = ({ fileName }) => {
  // localization method
  //   const { t } = useTranslation('chatCard');
  return (
    <Box display={'flex'} alignItems={'center'} gap={'2'}>
      <BsFileEarmark />
      <Text>{fileName}</Text>
    </Box>
  );
};

export default FilePreview;
