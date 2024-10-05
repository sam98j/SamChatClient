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
  // play and pause icon
  const PlayPauseIcon = isAudioPlaying ? BsFillPauseFill : BsFillPlayFill;
  // audio ref
  const audioRef = useRef<HTMLAudioElement>(null);
  // timeline ref
  const timeLineRef = useRef<HTMLSpanElement>(null);
  // timeline
  const timeline = timeLineRef.current!;
  // component mount, load audio element
  useEffect(() => audioRef.current?.load(), []);
  // transitionend event listener handler
  const transitionEndHandler = () => {
    // set video time line width
    timeline!.style.width = '0%';
    // set video timeline transition
    timeline!.style.transition = 'none';
    setAudioPlaying(false);
  };
  // listen for audo ref
  audioRef.current?.addEventListener('timeupdate', () => {
    // audio element
    const audioElement = audioRef.current!;
    // set time line styles
    const timeLineProgress = `${(Math.round(audioElement.currentTime) / Math.round(Number(duration))) * 100}%`;
    // set video time line width
    timeline!.style.width = timeLineProgress;
    // set video timeline transition
    timeline!.style.transition = 'width 1s linear';
    // check if audio is completed
    timeline.removeEventListener('transitionend', transitionEndHandler);
  });
  // on play
  audioRef.current?.addEventListener('ended', () => {
    // listener
    timeline!.addEventListener('transitionend', transitionEndHandler);
  });
  // handle play audio
  const audioPlayHandler = () => {
    // play audio
    if (audioRef.current?.paused) {
      audioRef.current?.play();
      setAudioPlaying(true);
      return;
    }
    // pause video
    audioRef.current?.pause();
    setAudioPlaying(false);
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
        <span className="text-sm px-1 rounded-lg">
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
