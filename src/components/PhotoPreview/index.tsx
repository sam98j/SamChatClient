import { Box, Text } from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { BsImage } from 'react-icons/bs';

const PhotoPreview = () => {
  // localization method
  const { t } = useTranslation('chatCard');
  return (
    <Box display={'flex'} alignItems={'center'} gap={'2'}>
      <BsImage />
      <Text>{t('photo')}</Text>
    </Box>
  );
};

export default PhotoPreview;
