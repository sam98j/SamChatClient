/* eslint-disable react/no-unknown-property */
import Image from 'next/image';
import React, { FC, useState } from 'react';
import styles from './styles.module.scss';
import { useRouter } from 'next/router';
import { Box, Text } from '@chakra-ui/react';
import {
  IoShareOutline,
  IoReturnUpForward,
  IoArrowBack,
} from 'react-icons/io5';
import { CiMenuKebab } from 'react-icons/ci';
import useTranslation from 'next-translate/useTranslation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { TimeUnits, getTime } from '@/utils/time';
import { ChatMessage } from '@/interfaces/chat.interface';
import FileMsgUploadIndicator from '../FileMsgUploadIndicator';
import MediaViewerOptionsMenu from '../MediaViewerOptionsMenu';

type Props = Pick<ChatMessage, 'content' | 'sender' | 'date' | '_id'>;

const ImageMsgViewer: FC<{ data: Props }> = ({ data }) => {
  // api url
  const apiHost = process.env.NEXT_PUBLIC_API_URL;
  // destruct props
  const { content, date, sender, _id } = data;
  // redux store
  const { loggedInUsr } = useSelector((state: RootState) => ({
    loggedInUsr: state.auth.currentUser,
  }));
  // is Message sended by the current usr
  const sendedByMe = loggedInUsr?._id === sender._id;
  // photo's sender name
  const photoSenderName = data.sender.name;
  // image url
  const [imgUrl] = useState(() => {
    // check if content contain http
    if (content.includes('data:')) return content;
    // otherwize
    return `${apiHost}${content}`;
  });
  // state
  const [isOpen, setIsOpen] = useState(false);
  // is menu options is opened
  const [isMenuOptionsOpen, setIsMenuOptionsOpen] = useState(false);
  // localiztion method
  const { t } = useTranslation('chatScreen');
  // app lang
  const { locale } = useRouter();
  // handle onclick
  const handleClick = () => {
    if (isOpen) return;
    setIsOpen(true);
  };
  const handleClose = () => {
    if (isMenuOptionsOpen) return setIsMenuOptionsOpen(false);
    // close screen
    setIsOpen(false);
    // close options menu
  };
  // optionsMenuClickHandler
  const optionsMenuClickHandler = () => {
    setIsMenuOptionsOpen(!isMenuOptionsOpen);
  };
  // handle share btn
  const shareMediaHandler = () => {};
  return (
    <div
      className={styles.imageMsgViewer}
      key={_id}
      is-open={String(isOpen)}
      pref-lang={locale}
    >
      {/* photo upload indicator */}
      <FileMsgUploadIndicator _id={_id} />
      {/* menu */}
      <MediaViewerOptionsMenu mediaUrl={content} isOpen={isMenuOptionsOpen} />
      {/* viewer header */}
      <div className={styles.viewerHeader}>
        {/* back arrow */}
        <Box
          onClick={handleClose}
          display={'flex'}
          alignItems={'center'}
          gap={2}
          color={'white'}
          cursor={'pointer'}
        >
          <IoArrowBack size={'1.5rem'} />
          {/* message sender */}
          <Box>
            <Text>{sendedByMe ? t('you') : photoSenderName}</Text>
            <Text fontSize={'.8rem'}>
              {getTime(date, TimeUnits.fullTime, locale as never)}
            </Text>
          </Box>
        </Box>
        {/* options */}
        <Box
          display={'flex'}
          alignItems={'center'}
          flexGrow={1}
          justifyContent={'flex-end'}
          gap={5}
        >
          <Box cursor={'pointer'} onClick={shareMediaHandler}>
            <IoShareOutline size={'1.5rem'} color="white" />
          </Box>
          <Box>
            <IoReturnUpForward size={'1.5rem'} color="white" />
          </Box>
          <Box
            onClick={optionsMenuClickHandler}
            position={'relative'}
            cursor={'pointer'}
          >
            <CiMenuKebab size={'1.5rem'} color="white" />
          </Box>
        </Box>
      </div>
      {/* viewer body */}
      <div className={styles.viewerBody}>
        <Image
          src={imgUrl}
          alt="msg"
          width={250}
          height={300}
          onClick={handleClick}
        />
      </div>
      {/* viewer footer */}
      <div className={styles.viewerFooter}></div>
    </div>
  );
};

export default ImageMsgViewer;
