/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { Box, IconButton, Text } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';
import { BsFillPauseFill, BsFillPlayFill } from 'react-icons/bs';
import { secondsToDurationConverter } from '@/utils/time';
import { ChatMessage } from '@/interfaces/chat.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

type Props = Pick<ChatMessage, 'senderId' | 'voiceNoteDuration' | 'content'>;

const VoiceMemoPlayer: React.FC<{ data: Props }> = ({ data }) => {
  // api url
  const apiHost = process.env.NEXT_PUBLIC_API_URL;
  // destruct props
  const { senderId, content, voiceNoteDuration: duration } = data;
  // get data from redux store
  const { currentUsr } = useSelector((state: RootState) => ({ currentUsr: state.auth.currentUser }));
  // is voice note is sended by current loogedIn usr ?
  const sendedByMe = senderId === currentUsr;
  // audio content or url
  const [audioUrl] = useState(() => {
    // check if content contain http
    if (content.includes('data:')) return content;
    // otherwize
    return `${apiHost}${content}`;
  });
  // audio ref
  const audioRef = useRef<HTMLAudioElement>(null);
  // timeline ref
  const timeLineRef = useRef<HTMLSpanElement>(null);
  // is audio playing
  const [isAudioPlaying, setAudioPlaying] = useState(false);
  // audio timer
  let timer = 0;
  // component mount
  useEffect(() => {
    audioRef.current?.load();
  }, []);
  // handle play audio
  const audioPlayHandler = () => {
    timeLineRef.current?.setAttribute('style', 'width: 0%');
    audioRef.current?.play();
    setAudioPlaying(true);
    const interval = setInterval(() => {
      timer++;
      timeLineRef.current?.setAttribute('style', `width:${(timer / Number(duration)) * 100}%`);
      if (timer === Number(duration)) {
        clearInterval(interval);
        setAudioPlaying(false);
      }
    }, 1000);
  };
  return (
    <div className={styles.voice_memo_rec} sended-by-me={String(sendedByMe)}>
      <IconButton
        isRound={true}
        colorScheme='blue'
        aria-label=''
        icon={<Icon as={isAudioPlaying ? BsFillPauseFill : BsFillPlayFill} onClick={audioPlayHandler} boxSize={'7'} />}
      />
      <Box display={'flex'} flexDirection={'column'} gap={'4'}>
        <div className={styles.time_line}>
          <span ref={timeLineRef} className={styles.time_line_filler}></span>
        </div>
        <Text lineHeight={'0'} fontSize={'sm'} className={styles.timer} textColor={'gray'}>
          {secondsToDurationConverter(Number(duration))}
        </Text>
      </Box>
      <audio ref={audioRef}>
        <source src={audioUrl} type='audio/webm' />
      </audio>
    </div>
  );
};

export default VoiceMemoPlayer;
