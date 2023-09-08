/* eslint-disable no-constant-condition */
/* eslint-disable react/no-unknown-property */
import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import {
    Box,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Spinner,
    Text,
} from '@chakra-ui/react';
import { ImAttachment } from 'react-icons/im';
import { BsMic, BsStopFill } from 'react-icons/bs';
import { BiSticker } from 'react-icons/bi';
import { IoSend } from 'react-icons/io5';
import { Icon } from '@chakra-ui/icons';
import { Socket} from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import NextImage from 'next/image';
import NoMessageDrow from '../../../assets/vectors/undraw_new_message_re_fp03.svg';
import { useSearchParams } from 'next/navigation';
import { v4 as uuid } from 'uuid';
import { ChatMessage, ChatUserActions} from '../../interfaces/chat.interface';
import { useDispatch } from 'react-redux';
import {
    // setChatUsrStatus,
    // setChatUsrTyping,
    setCurrentUsrDoingAction,
    setMessageToSent,
    // setMessageStatus,
    setOpenedChat,
} from '@/redux/chats.slice';
import { getChatMessages, getUsrOnlineStatus } from '@/apis/chats.api';
import ChatMassage from '@/components/ChatMassage';
import {
    // playReceiveMessageSound,
    // playSentMessageSound,
    voiceMemoTimer,
} from '../../utils/chat.util';
import { setCurrentRoute } from '@/redux/system.slice';
import { useRouter } from 'next/router';
import { AnyAction } from '@reduxjs/toolkit';
import VoiceMemoRecorder from '@/utils/hooks/voiceMemoRecorder';
import getBlobDuration from 'get-blob-duration';
import useTranslation from 'next-translate/useTranslation';

interface ChatInterface {
    msgText: string;
    opened_socket: Socket | null;
}
const {start, stop, cancel} = VoiceMemoRecorder();

const Chat = () => {
    console.log('chat render');
    // translate
    const {t} = useTranslation('chatScreen');
    // langs
    const { locale } = useRouter();
    // use voiceMemo Recorder hook
    // redux store dispatch function
    const dispatch = useDispatch();
    // use ref
    const chatRef = useRef<HTMLDivElement>(null);
    const { currentUsr, openedChat, chatMessages, chatName } = useSelector(
        (state: RootState) => {
            return {
                currentUsr: state.auth.currentUser!,
                openedChat: state.chat.openedChat,
                chatMessages: state.chat.chatMessages,
                chatName: state.system.currentRoute
            };
        }
    );
    const parmas = useSearchParams();
    const [isRec, setIsReco] = useState(false);
    // timer
    const [timer, setTimer] = useState('00:00');
    // timer interval
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timer>();
    // get url params
    const [state, setState] = useState<ChatInterface>({
        msgText: '',
        opened_socket: null
    });
    // handleInputFocus
    const handleInputFocus = () => dispatch(setCurrentUsrDoingAction(ChatUserActions.TYPEING));
    // handleInputBlur
    const handleInputBlur = () => dispatch(setCurrentUsrDoingAction(null));
    // opened socket
    // inputChangeHandler
    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };
    // handle start recrding vioice
    const startRecVoiceMemoHandler = async () => {
        await start();
        setIsReco(true);
        setTimerInterval(voiceMemoTimer(setTimer));
    };
    // handle stop recrding vioice
    const stopRecVoiceMemoHandler = () => {
        setIsReco(false);
        cancel();
        clearInterval(timerInterval);
    };
    // handleSendBtnClick
    const handleSendBtnClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if(isRec && !state.msgText){
            clearInterval(timerInterval);
            const blob = await stop();
            const reader = new FileReader();
            reader.addEventListener('load' ,async (e) => {
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
                    voiceNoteDuration: String(Math.round(duration))
                } as ChatMessage;
                dispatch(setMessageToSent(message));
                // send message with web sockets
                // set isRec
                setIsReco(false);
            });
            reader.readAsDataURL(blob as Blob);
        }
        // create meassge
        if(state.msgText) {
            const message = {
                _id: uuid(),
                receiverId: parmas.get('id'),
                senderId: currentUsr,
                text: state.msgText,
                date: new Date().toString(),
                status: null,
                isItTextMsg: true
            } as ChatMessage;
            dispatch(setMessageToSent(message));
            // send message with web sockets
            // clear the input
            setState({
                ...state,
                msgText: '',
            });
            return;
        }
    };
    // scroll to the bottom of the view
    useEffect(() => {
        // scroll view to the end after send msg
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, [chatMessages]);
    // component did mount life cicle hook
    useEffect(() => {
        // set route name
        dispatch(setCurrentRoute(openedChat!.usrname!));
        // get usr online status
        dispatch(getUsrOnlineStatus(parmas.get('id')!) as unknown as AnyAction);
        // check for chat opened
        if (openedChat) {dispatch(getChatMessages(parmas.get('id')!) as unknown as AnyAction);}
        // clean up when component unmount
        return function cleanUp() {dispatch(setOpenedChat(undefined));};
    }, []);
    // dummy messages
    return (
        <>
            <Head>
                <title>{chatName}</title>
            </Head>
            <div className={styles.chat} ref={chatRef} pref-lang={locale}>
                {/* chat messages */}
                {chatMessages === null ? (
                    <Spinner className={styles.spinner} />
                ) : chatMessages!.length ? (
                    chatMessages!.map((msg) => (<ChatMassage messageData={msg} key={Math.random()}/> ))
                ) : (
                    <Box className={styles.imgContainer}>
                        <NextImage src={NoMessageDrow} alt='' />
                        <Text textColor={'gray'} fontSize={'1.5rem'}>
                            No Messages Yet
                        </Text>
                    </Box>
                )}
                {/* chat footer */}
                <Box
                    className={styles.footer}
                    bgColor={'gray.50'}
                    gap={4}
                    padding={'10px'}
                    display={'flex'}
                    alignItems={'center'}
                >
                    {/* attach and flashing mic */}
                    <IconButton aria-label='' isRound={true} is-voice-rec={String(isRec)} className={styles.mic_atta_icon}>
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
                            <Icon
                                as={BiSticker}
                                boxSize={5}
                                color={'messenger.500'}
                            />
                        </InputRightElement>
                        <Input
                            variant='filled'
                            placeholder={t('typeMessagePlaceholder')}
                            borderRadius={'20px'}
                            value={state?.msgText}
                            name='msgText'
                            onChange={inputChangeHandler}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />
                    </InputGroup>
                    {isRec ? <IconButton icon={<Icon as={BsStopFill} />} isRound={true} aria-label=''
                        colorScheme={'red'} onClick={stopRecVoiceMemoHandler}/> : ''}
                    {!isRec && !state.msgText ? <IconButton icon={<Icon as={BsMic} boxSize={5}/>} isRound={true} aria-label=''
                        colorScheme={'messenger'} onClick={startRecVoiceMemoHandler}/> : ''}
                    {isRec || state.msgText ? <IconButton
                        onClick={handleSendBtnClick}
                        isRound={true}
                        className={styles.send_btn}
                        icon={<Icon as={IoSend} boxSize={5} color={'white'}/>}
                        aria-label=''
                        colorScheme={'messenger'}
                    /> : ''}
                </Box>
            </div>
        </>
    );
};

export default Chat;
