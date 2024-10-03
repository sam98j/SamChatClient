/* eslint-disable react/no-unknown-property */
import React, { FC, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { useSelector } from 'react-redux';
import useTranslation from 'next-translate/useTranslation';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import { Box, Text } from '@chakra-ui/react';
import {
  IoArrowBack,
  IoReturnUpForward,
  IoShareOutline,
  IoVolumeHighOutline,
} from 'react-icons/io5';
import { TimeUnits, getTime } from '@/utils/time';
import { CiMenuKebab, CiSettings } from 'react-icons/ci';
import { BsFullscreen, BsPauseFill, BsPlayFill } from 'react-icons/bs';
import { TbPictureInPicture } from 'react-icons/tb';
import { secondsToDurationConverter } from '@/utils/time';
import { ChatMessage } from '@/interfaces/chat.interface';
import FileMsgUploadIndicator from '../FileMsgUploadIndicator';
import { MdOutlineForward10, MdOutlineReplay10 } from 'react-icons/md';

// props
type Props = Pick<ChatMessage, 'content' | 'sender' | 'date' | '_id'>;

const VideoMsgPlayer: FC<{ data: Props }> = ({ data }) => {
  // api url
  const apiHost = process.env.NEXT_PUBLIC_API_URL;
  // destruct props
  const { content, date, sender, _id } = data;
  // get data from redux store
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  // is video is sended by the current loggedIn usr
  const sendedByMe = currentUser?._id === sender._id;
  // video sender name
  const videoSenderName = data.sender.name;
  // vido url
  const videoUrl = content.includes('data:') ? content : `${apiHost}${content}`;
  // state
  const [isOpen, setIsOpen] = useState(false);
  // localiztion method
  const { t } = useTranslation('chatScreen');
  // video current time
  const [videoCurrentTime, setVideoCurrentTime] = useState('00:00');
  // is video played or paused
  const [videoPlayingStatus, setVideoPlayingStatus] = useState(false);
  // video ref
  const videoRef = useRef<HTMLVideoElement>(null);
  // timeLine ref
  const timeLineRef = useRef<HTMLSpanElement>(null);
  // app lang
  const { locale } = useRouter();
  // handle onclick
  const handleClick = () => !isOpen && setIsOpen(true);
  // close video handler
  const handleClose = () => setIsOpen(false);
  // video element
  const videoElement = videoRef.current!;
  // time line element
  const timeLineElement = timeLineRef.current;
  // video play/pause icon
  const VideoPlayPauseIcon = videoPlayingStatus ? BsPauseFill : BsPlayFill;
  // video time update handler
  const videoTimeUpdateHandler = () => {
    // video current time
    const vidCurrentTime = secondsToDurationConverter(videoElement.currentTime);
    // set video current time
    setVideoCurrentTime(vidCurrentTime);
    // set time line styles
    const timeLineProgress = `${(Math.round(videoElement.currentTime) / Math.round(videoElement.duration)) * 100}%`;
    // set video time line width
    timeLineElement!.style.width = timeLineProgress;
    // set video timeline transition
    timeLineElement!.style.transition = 'width 1s linear';
  };
  // on play
  videoElement &&
    videoElement.addEventListener('ended', () => {
      timeLineElement!.addEventListener('transitionend', () => {
        // set video time line width
        timeLineElement!.setAttribute('style', 'width: 0%; transition: none');
        setVideoPlayingStatus(false);
      });
    });
  // on play
  videoElement &&
    videoElement.addEventListener('timeupdate', videoTimeUpdateHandler);
  // handle video play and pause
  const handleVidePlayPause = () => {
    // play video
    if (videoElement.paused) {
      videoElement.play();
      setVideoPlayingStatus(true);
      return;
    }
    // pause video
    videoElement.pause();
    setVideoPlayingStatus(false);
  };
  // handleShare
  const handleShare = () => {};

  return (
    <div
      className={styles.videoMsgViewer}
      is-open={String(isOpen)}
      pref-lang={locale}
    >
      {/* video upload indicator */}
      <FileMsgUploadIndicator _id={_id} />
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
          {/* go back arrow */}
          <IoArrowBack size={'1.5rem'} />
          {/* message sender */}
          <Box>
            {/* message sender */}
            <Text>{sendedByMe ? t('you') : videoSenderName}</Text>
            {/* message date and time */}
            <Text fontSize={'.8rem'}>
              {getTime(date, TimeUnits.fullTime, locale as never)}
            </Text>
          </Box>
        </Box>
        {/* options (share, forward, menu) */}
        <Box
          display={'flex'}
          alignItems={'center'}
          flexGrow={1}
          justifyContent={'flex-end'}
          gap={5}
        >
          <IoShareOutline size={'1.5rem'} color="white" onClick={handleShare} />
          <IoReturnUpForward size={'1.5rem'} color="white" />
          <CiMenuKebab size={'1.5rem'} color="white" />
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
            <MdOutlineReplay10 size={'1.2rem'} />
            <VideoPlayPauseIcon size={'1.3rem'} onClick={handleVidePlayPause} />
            <MdOutlineForward10 size={'1.2rem'} />
          </Box>
          {/* video options (time, fullscreen, pip etc. ) */}
          <div className="flex flex-grow items-center justify-end gap-3">
            <BsFullscreen size={'.8rem'} />
            <TbPictureInPicture size={'1.2rem'} />
            <CiSettings size={'1.2rem'} />
            <IoVolumeHighOutline size={'1.2rem'} />
            <Text marginBottom={'-5px'} className={styles.videoCurrentTime}>
              {videoCurrentTime}
            </Text>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default VideoMsgPlayer;
