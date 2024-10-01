/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { BsFillPauseFill, BsFillPlayFill } from 'react-icons/bs';
import { secondsToDurationConverter } from '@/utils/time';
import { ChatMessage } from '@/interfaces/chat.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

type Props = Pick<ChatMessage, 'sender' | 'voiceNoteDuration' | 'content'>;

const VoiceMemoPlayer: React.FC<{ data: Props }> = ({ data }) => {
  // api url
  const apiHost = process.env.NEXT_PUBLIC_API_URL;
  // destruct props
  const { sender, content, voiceNoteDuration: duration } = data;
  // get data from redux store
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  // is voice note is sended by current loogedIn usr ?
  const sendedByMe = sender._id === currentUser?._id;
  // audio content or url
  const audioUrl = content.includes('data:') ? content : `${apiHost}${content}`;
  // is audio playing
  const [isAudioPlaying, setAudioPlaying] = useState(false);
  // audio timer
  let [timer, setTimer] = useState(0);
  // play and pause icon
  const PlayPauseIcon = isAudioPlaying ? BsFillPauseFill : BsFillPlayFill;
  // audio ref
  const audioRef = useRef<HTMLAudioElement>(null);
  // timeline ref
  const timeLineRef = useRef<HTMLSpanElement>(null);
  // component mount, load audio element
  useEffect(() => audioRef.current?.load(), []);
  // interval
  let [interval, resetInterval] = useState<NodeJS.Timer>(null!);
  // handle play audio
  const audioPlayHandler = () => {
    // audio playing status
    const audioPlayingStatus = !isAudioPlaying;
    // set audio play status
    setAudioPlaying(audioPlayingStatus);
    // timeline
    const timeline = timeLineRef.current!;
    // if audio is stopped
    if (!audioPlayingStatus) {
      clearInterval(interval);
      audioRef.current?.pause();
      return;
    }
    // play audio
    audioRef.current?.play();
    // repeate every 1 seconds
    const setinterval = setInterval(() => {
      // inc timer
      setTimer(timer++);
      // current timeline width
      const timeLineProgress = (timer / Number(duration)) * 100;
      // set time line progress
      timeline.setAttribute(
        'style',
        `width:${timeLineProgress}%; transition: all 1s linear`,
      );
      // when audo playing is completed
      if (timer !== Number(duration)) return;
      // clear interval
      clearInterval(setinterval);
      // wait until transition end
      timeline.addEventListener('transitionend', () => {
        // reset styles
        timeline.setAttribute('style', 'transition: none; width: 0%');
        // set timer
        setTimer(0);
        // audio is stopped
        setAudioPlaying(false);
      });
    }, 1000);
    // make timer global
    resetInterval(setinterval);
  };
  return (
    <div className={styles.voice_memo_rec} sended-by-me={String(sendedByMe)}>
      {/* play / pause icon */}
      <PlayPauseIcon onClick={audioPlayHandler} size={'2rem'} />
      {/* player container */}
      <div className="flex gap-2 items-center flex-grow">
        {/* time line */}
        <div className={styles.time_line}>
          <span ref={timeLineRef} className={styles.time_line_filler}></span>
        </div>
        {/* timer */}
        <span className="text-sm bg-gray-200 px-1 rounded-lg">
          {secondsToDurationConverter(Number(duration))}
        </span>
      </div>
      {/* audio element */}
      <audio ref={audioRef}>
        <source src={audioUrl} type="audio/webm" />
      </audio>
    </div>
  );
};

export default VoiceMemoPlayer;
