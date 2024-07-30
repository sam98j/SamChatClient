/* eslint-disable react/no-unknown-property */
import Image from 'next/image';
import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { useRouter } from 'next/router';
import { Box, Text } from '@chakra-ui/react';
import { IoShareOutline, IoReturnUpForward, IoArrowBack } from 'react-icons/io5';
import { CiMenuKebab } from 'react-icons/ci';
import useTranslation from 'next-translate/useTranslation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { TimeUnits, getTime } from '@/utils/time';
import { ChatMessage } from '@/interfaces/chat.interface';

type Props = Pick<ChatMessage, 'content' | 'senderId' | 'date' | '_id'>;

const ImageMsgViewer: FC<{ data: Props }> = ({ data }) => {
  // api url
  const apiHost = process.env.NEXT_PUBLIC_API_URL;
  // destruct props
  const { content, date, senderId, _id } = data;
  // use ref
  const photoUploadProgressRef = useRef<HTMLDivElement>(null);
  // redux store
  const { lastChatMessage, chatUsr, loggedInUsrId, fileMessageUploadIndicator } = useSelector((state: RootState) => ({
    chatUsr: state.chat.openedChat?.usrname,
    loggedInUsrId: state.auth.currentUser,
    fileMessageUploadIndicator: state.chat.fileMessageUploadIndicator,
    lastChatMessage: state.chat.chatMessages![state.chat.chatMessages?.length! - 1],
  }));
  // is photo upload progress visible
  const [isUploadProgressVisable, setIsUploadProgressVisable] = useState(
    () => _id === lastChatMessage._id && lastChatMessage.status === null
  );
  // is Message sended by the current usr
  const sendedByMe = loggedInUsrId === senderId;
  // image url
  const [imgUrl] = useState(() => {
    // check if content contain http
    if (content.includes('data:')) return content;
    // otherwize
    return `${apiHost}${content}`;
  });
  // state
  const [isOpen, setIsOpen] = useState(false);
  // localiztion method
  const { t } = useTranslation('chatScreen');
  // app lang
  const { locale } = useRouter();
  // handle onclick
  const handleClick = () => {
    if (isOpen) return;
    setIsOpen(true);
  };
  const handleClose = () => setIsOpen(false);
  // fileMessageUploadProgress observer
  useEffect(() => {
    // terminate if it's not avilable
    if (!fileMessageUploadIndicator) return;
    // photoMessageUploadProgressElement
    const photoMessageUploadProgressElement = photoUploadProgressRef.current;
    // set the width of the element
    photoMessageUploadProgressElement?.style.setProperty('width', `${fileMessageUploadIndicator}%`);
  }, [fileMessageUploadIndicator]);
  // last message obsserver
  useEffect(() => {
    // terminate if no last message
    if (!lastChatMessage) return;
    setIsUploadProgressVisable(_id === lastChatMessage._id && lastChatMessage.status === null);
  }, [lastChatMessage]);
  return (
    <div className={styles.imageMsgViewer} key={_id} is-open={String(isOpen)} pref-lang={locale}>
      {/* Photo Upload Indicator */}
      <div className={styles.photoUploadIndicator} style={{ display: isUploadProgressVisable ? 'initial' : 'none' }}>
        <div className={styles.photoUploadProgress} ref={photoUploadProgressRef}></div>
      </div>
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
        <Image src={imgUrl} alt='msg' width={250} height={300} onClick={handleClick} />
      </div>
      {/* viewer footer */}
      <div className={styles.viewerFooter}></div>
    </div>
  );
};

export default ImageMsgViewer;
