import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import styles from './styles.module.scss';
import React, { useState } from 'react';
import { Icon } from '@chakra-ui/icons';
import { BsMic, BsStopFill } from 'react-icons/bs';
import { ImAttachment } from 'react-icons/im';
import { BiSticker } from 'react-icons/bi';
import useTranslation from 'next-translate/useTranslation';
import { IoSend } from 'react-icons/io5';
import { ChatMessage, ChatUserActions } from '@/interfaces/chat.interface';
import { useDispatch } from 'react-redux';
import {
  setCurrentUsrDoingAction,
  setMessageToSent,
} from '@/redux/chats.slice';
import VoiceMemoRecorder from '@/utils/hooks/voiceMemoRecorder';
import { voiceMemoTimer } from '@/utils/chat.util';
import getBlobDuration from 'get-blob-duration';
import { v4 as uuid } from 'uuid';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
const { start, stop, cancel } = VoiceMemoRecorder();

const ChatInput = () => {
  // redux dispatch method
  const dispatch = useDispatch();
  // locales
  const { locale } = useRouter();
  // input text
  const [inputText, setInputText] = useState('');
  // timer interval
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timer>();
  // current logged usr
  const currentUsr = useSelector((state: RootState) => state.auth.currentUser);
  // url params
  const parmas = useSearchParams();
  // translatios
  const { t } = useTranslation('chatScreen');
  // is voice recording
  const [isRec, setIsReco] = useState(false);
  // timer
  const [timer, setTimer] = useState('00:00');
  // handleInputFocus
  const handleInputFocus = () =>
    dispatch(setCurrentUsrDoingAction(ChatUserActions.TYPEING));
  // handleInputBlur
  const handleInputBlur = () => dispatch(setCurrentUsrDoingAction(null));
  // inputChangeHandler
  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };
  // start recording voice
  const startRecVoiceMemoHandler = async () => {
    dispatch(setCurrentUsrDoingAction(ChatUserActions.RECORDING_VOICE));
    await start();
    setIsReco(true);
    setTimerInterval(voiceMemoTimer(setTimer));
  };
  // handle stop recrding vioice
  const stopRecVoiceMemoHandler = () => {
    dispatch(setCurrentUsrDoingAction(null));
    setIsReco(false);
    cancel();
    clearInterval(timerInterval);
  };
  // handleSendBtnClick
  const handleSendBtnClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    // send voice msg if it's recording and input is empty
    if (isRec && !inputText) {
      dispatch(setCurrentUsrDoingAction(null));
      clearInterval(timerInterval);
      const blob = await stop();
      const reader = new FileReader();
      reader.addEventListener('load', async (e) => {
        const duration = await getBlobDuration(e.target?.result as string);
        // new Audio(e.target?.result as string, {ty});
        const message = {
          _id: uuid(),
          receiverId: parmas.get('id'),
          senderId: currentUsr,
          text: e.target?.result as string,
          date: new Date().toString(),
          status: null,
          isItTextMsg: false,
          voiceNoteDuration: String(Math.round(duration)),
        } as ChatMessage;
        dispatch(setMessageToSent(message));
        // send message with web sockets
        // set isRec
        setIsReco(false);
      });
      reader.readAsDataURL(blob as Blob);
    }
    // create meassge
    if (inputText) {
      const message = {
        _id: uuid(),
        receiverId: parmas.get('id'),
        senderId: currentUsr,
        text: inputText,
        date: new Date().toString(),
        status: null,
        isItTextMsg: true,
      } as ChatMessage;
      dispatch(setMessageToSent(message));
      // send message with web sockets
      // clear the input
      setInputText('');
      return;
    }
  };
  return (
    <Box
      className={styles.footer}
      bgColor={'gray.50'}
      gap={4}
      padding={'10px'}
      display={'flex'}
      alignItems={'center'}
      pref-lang={locale}
    >
      {/* attach and flashing mic */}
      <IconButton
        aria-label=''
        isRound={true}
        is-voice-rec={String(isRec)}
        className={styles.mic_atta_icon}
      >
        <Icon
          as={isRec ? BsMic : ImAttachment}
          boxSize={5}
          color={'messenger.500'}
        />
      </IconButton>
      <Box flexGrow={'1'} textColor={'gray'} display={!isRec ? 'none' : 'flex'}>
        <Text> {timer} </Text>
        <Text>{t('rec_voice')}</Text>
      </Box>
      <InputGroup display={isRec ? 'none' : 'initial'}>
        <InputRightElement className={styles.input_inner_icon}>
          <Icon as={BiSticker} boxSize={5} color={'messenger.500'} />
        </InputRightElement>
        <Input
          variant='filled'
          placeholder={t('typeMessagePlaceholder')}
          borderRadius={'20px'}
          value={inputText}
          name='msgText'
          onChange={inputChangeHandler}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </InputGroup>
      {isRec ? (
        <IconButton
          icon={<Icon as={BsStopFill} />}
          isRound={true}
          aria-label=''
          colorScheme={'red'}
          onClick={stopRecVoiceMemoHandler}
        />
      ) : (
        ''
      )}
      {!isRec && !inputText ? (
        <IconButton
          icon={<Icon as={BsMic} boxSize={5} />}
          isRound={true}
          aria-label=''
          colorScheme={'messenger'}
          onClick={startRecVoiceMemoHandler}
        />
      ) : (
        ''
      )}
      {isRec || inputText ? (
        <IconButton
          onClick={handleSendBtnClick}
          isRound={true}
          className={styles.send_btn}
          icon={<Icon as={IoSend} boxSize={5} color={'white'} />}
          aria-label=''
          colorScheme={'messenger'}
        />
      ) : (
        ''
      )}
    </Box>
  );
};

export default ChatInput;
