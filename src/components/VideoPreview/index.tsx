import { Box, Text } from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { HiOutlineVideoCamera } from 'react-icons/hi';

const VideoPreview = () => {
  // localization method
  const { t } = useTranslation('chatCard');
  return (
    <Box display={'flex'} alignItems={'center'} gap={'2'}>
      <HiOutlineVideoCamera size={'1.3rem'} />
      <Text>{t('video')}</Text>
    </Box>
  );
};

export default VideoPreview;
