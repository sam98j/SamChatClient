/* eslint-disable react/no-unknown-property */
import React, { FC, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { useSelector } from 'react-redux';
import useTranslation from 'next-translate/useTranslation';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import { Box, Text } from '@chakra-ui/react';
import { IoArrowBack, IoReturnUpForward, IoShareOutline, IoVolumeHighOutline } from 'react-icons/io5';
import { TimeUnits, getTime } from '@/utils/time';
import { CiMenuKebab, CiSettings } from 'react-icons/ci';
import { BsFullscreen, BsPlay } from 'react-icons/bs';
import { TbPictureInPicture, TbRewindBackward10, TbRewindForward10 } from 'react-icons/tb';
import { secondsToDurationConverter } from '@/utils/time';
import { ChatMessage } from '@/interfaces/chat.interface';
import FileMsgUploadIndicator from '../FileMsgUploadIndicator';
// import { secondsToDurationConverter } from '@/utils/voiceMemoRec';

// props
type Props = Pick<ChatMessage, 'content' | 'sender' | 'date' | '_id'>;

const VideoMsgPlayer: FC<{ data: Props }> = ({ data }) => {
  // api url
  const apiHost = process.env.NEXT_PUBLIC_API_URL;
  // destruct props
  const { content, date, sender, _id } = data;
  // get data from redux store
  const { chatUsr, currentUsr } = useSelector((state: RootState) => ({
    chatUsr: state.chat.openedChat?.name,
    currentUsr: state.auth.currentUser,
  }));
  // is video is sended by the current loggedIn usr
  const sendedByMe = currentUsr?._id === sender._id;
  // vido url
  const [videoUrl] = useState(() => {
    // check for content is data url or link
    // check if content contain http
    if (content.includes('data:')) return content;
    // otherwize
    return `${apiHost}${content}`;
  });
  // state
  const [isOpen, setIsOpen] = useState(false);
  // localiztion method
  const { t } = useTranslation('chatScreen');
  // video current time
  const [videoCurrentTime, setVideoCurrentTime] = useState('00:00');
  // video ref
  const videoRef = useRef<HTMLVideoElement>(null);
  // timeLine ref
  const timeLineRef = useRef<HTMLSpanElement>(null);
  // app lang
  const { locale } = useRouter();
  // handle onclick
  const handleClick = () => {
    if (isOpen) return;
    setIsOpen(true);
  };
  const handleClose = () => setIsOpen(false);
  // handleVidePlayPause
  const videoElement = videoRef.current!;
  // load video
  // time line element
  const timeLineElement = timeLineRef.current;
  // on play
  videoElement &&
    videoElement.addEventListener('timeupdate', () => {
      setVideoCurrentTime(secondsToDurationConverter(videoElement.currentTime));
      timeLineElement?.setAttribute(
        'style',
        `width: ${(Math.round(videoElement.currentTime) / Math.round(videoElement.duration)) * 100}%`
      );
    });
  // handle video play and pause
  const handleVidePlayPause = () => {
    if (videoElement.paused) {
      videoElement.play();
      return;
    }
    videoElement.pause();
  };
  // handleShare
  const handleShare = () => {};
  return (
    <div className={styles.videoMsgViewer} is-open={String(isOpen)} pref-lang={locale}>
      {/* video upload indicator */}
      <FileMsgUploadIndicator _id={_id} />
      {/* viewer header */}
      <div className={styles.viewerHeader}>
        {/* back arrow */}
        <Box onClick={handleClose} display={'flex'} alignItems={'center'} gap={2} color={'white'} cursor={'pointer'}>
          {/* go back arrow */}
          <IoArrowBack size={'1.5rem'} />
          {/* message sender */}
          <Box>
            {/* message sender */}
            <Text>{sendedByMe ? t('you') : chatUsr}</Text>
            {/* message date and time */}
            <Text fontSize={'.8rem'}>{getTime(date, TimeUnits.fullTime, locale as never)}</Text>
          </Box>
        </Box>
        {/* options (share, forward, menu) */}
        <Box display={'flex'} alignItems={'center'} flexGrow={1} justifyContent={'flex-end'} gap={5}>
          <IoShareOutline size={'1.5rem'} color='white' onClick={handleShare} />
          <IoReturnUpForward size={'1.5rem'} color='white' />
          <CiMenuKebab size={'1.5rem'} color='white' />
        </Box>
      </div>
      {/* viewer body */}
      <div className={styles.viewerBody}>
        <video onClick={handleClick} ref={videoRef}>
          <source src={videoUrl} />
        </video>
      </div>
      {/* viewer footer */}
      <div className={styles.viewerFooter}>
        {/* time line */}
        <div className={styles.timeLine}>
          <span ref={timeLineRef}></span>
        </div>
        {/*video controls */}
        <Box display={'flex'}>
          {/* video play pause rewind */}
          <Box display={'flex'} alignItems={'center'} gap={3}>
            <TbRewindForward10 size={'1.2rem'} />
            <BsPlay size={'1.2rem'} onClick={handleVidePlayPause} />
            <TbRewindBackward10 size={'1.2rem'} />
          </Box>
          {/* video options (time, fullscreen, pip etc. ) */}
          <Box display={'flex'} flexGrow={1} alignItems={'center'} gap={3} justifyContent={'flex-end'}>
            <BsFullscreen size={'.8rem'} />
            <TbPictureInPicture size={'1.2rem'} />
            <CiSettings size={'1.2rem'} />
            <IoVolumeHighOutline size={'1.2rem'} />
            <Text marginBottom={'-5px'} className={styles.videoCurrentTime}>
              {videoCurrentTime}
            </Text>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default VideoMsgPlayer;
