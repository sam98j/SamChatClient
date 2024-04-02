/* eslint-disable react/no-unknown-property */
import Image from 'next/image';
import React, { FC, useState } from 'react';
import styles from './styles.module.scss';
import { useRouter } from 'next/router';
import { Box, Text } from '@chakra-ui/react';
import { IoShareOutline, IoReturnUpForward, IoArrowBack } from 'react-icons/io5';
import { CiMenuKebab } from 'react-icons/ci';
import useTranslation from 'next-translate/useTranslation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { TimeUnits, getTime } from '@/utils/time';

const ImageMsgViewer: FC<{ url: string; sendedByMe: boolean; date: string }> = ({ url, sendedByMe, date }) => {
  // state
  const [isOpen, setIsOpen] = useState(false);
  // localiztion method
  const { t } = useTranslation('chatScreen');
  // redux store
  const chatUsr = useSelector((state: RootState) => state.chat.openedChat?.usrname);
  // app lang
  const { locale } = useRouter();
  // handle onclick
  const handleClick = () => {
    if (isOpen) return;
    setIsOpen(true);
  };
  const handleClose = () => setIsOpen(false);
  return (
    <div className={styles.imageMsgViewer} is-open={String(isOpen)} pref-lang={locale}>
      {/* viewer header */}
      <div className={styles.viewerHeader}>
        <Box onClick={handleClose} display={'flex'} alignItems={'center'} gap={2} color={'white'} cursor={'pointer'}>
          <IoArrowBack size={'1.5rem'} />
          {/* message sender */}
          <Box>
            <Text>{sendedByMe ? t('you') : chatUsr}</Text>
            <Text fontSize={'.8rem'}>{getTime(date, TimeUnits.fullTime, locale as never)}</Text>
          </Box>
        </Box>
        {/* options */}
        <Box display={'flex'} alignItems={'center'} flexGrow={1} justifyContent={'flex-end'} gap={5}>
          <IoShareOutline size={'1.5rem'} color='white' />
          <IoReturnUpForward size={'1.5rem'} color='white' />
          <CiMenuKebab size={'1.5rem'} color='white' />
        </Box>
      </div>
      {/* viewer body */}
      <div className={styles.viewerBody}>
        <Image src={url} alt='msg' width={250} height={300} onClick={handleClick} />
      </div>
      {/* viewer footer */}
      <div className={styles.viewerFooter}></div>
    </div>
  );
};

export default ImageMsgViewer;
