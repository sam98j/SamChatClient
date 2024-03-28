import { secondsToDurationConverter } from '@/utils/voiceMemoRec';
import { Box, Text } from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import React, { FC } from 'react';
import { BsMic } from 'react-icons/bs';

const VoiceMemoPreview: FC<{ duration: string }> = ({ duration }) => {
  // localization method
  const { t } = useTranslation('chatCard');
  return (
    <Box display={'flex'} alignItems={'center'} gap={1}>
      <BsMic size={'1.1rem'} />
      <Text>{t('voiceMsg')}</Text>
      <Text>{secondsToDurationConverter(Number(duration))}</Text>
    </Box>
  );
};

export default VoiceMemoPreview;
