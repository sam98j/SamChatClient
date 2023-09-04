/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { Box, IconButton, Text } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';
import { BsFillPauseFill, BsFillPlayFill } from 'react-icons/bs';
import { secondsToDurationConverter } from '@/utils/voiceMemoRec';

const VoiceMemoPlayer: React.FC<{data: {src: string, sendedByMe: boolean, voiceNoteDuration: string}}> = ({data}) => {
    const {sendedByMe, src, voiceNoteDuration} = data;
    // audio ref
    const audioRef = useRef<HTMLAudioElement>(null);
    // timeline ref
    const timeLineRef = useRef<HTMLSpanElement>(null);
    // is audio playing
    const [isAudioPlaying, setAudioPlaying] = useState(false);
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
            timeLineRef.current?.setAttribute('style', `width:${(timer / Number(voiceNoteDuration)) * 100}%`);
            if(timer === Number(voiceNoteDuration)) {clearInterval(interval); setAudioPlaying(false);}
        }, 1000);
    };
    return (
        <div className={styles.voice_memo_rec} sended-by-me={String(sendedByMe)}>
            <IconButton  
                isRound={true} 
                colorScheme={sendedByMe ? 'messenger' : 'whiteAlpha'} 
                aria-label='' 
                icon={<Icon 
                    as={isAudioPlaying ? BsFillPauseFill : BsFillPlayFill} 
                    onClick={audioPlayHandler}
                    boxSize={'7'}
                />
                }/>
            <Box display={'flex'} flexDirection={'column'} gap={'4'}>
                <div className={styles.time_line}><span ref={timeLineRef}></span></div>
                <Text 
                    lineHeight={'0'} 
                    fontSize={'sm'}
                    className={styles.timer}
                    textColor={'gray'}>{secondsToDurationConverter(Number(voiceNoteDuration))}
                </Text>
            </Box>
            <audio ref={audioRef}>
                <source src={src} type='audio/webm'/>
            </audio>
        </div>
    );
};

export default VoiceMemoPlayer;