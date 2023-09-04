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
import { Socket, io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import NextImage from 'next/image';
import NoMessageDrow from '../../../assets/vectors/undraw_new_message_re_fp03.svg';
import { useSearchParams } from 'next/navigation';
import { v4 as uuid } from 'uuid';
import { ChatMessage, MessageStatus } from '../../interfaces/chat.interface';
import { useDispatch } from 'react-redux';
import {
    addMessageToChat,
    setChatUsrStatus,
    setChatUsrTyping,
    setMessageStatus,
    setOpenedChat,
} from '@/redux/chats.slice';
import { getChatMessages, getUsrOnlineStatus } from '@/apis/chats.api';
import ChatMassage from '@/components/ChatMassage';
import {
    playReceiveMessageSound,
    playSentMessageSound,
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
    // api url
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
        opened_socket: null,
    });
    // handleInputFocus
    const handleInputFocus = () =>
        state.opened_socket?.emit('chatusr_typing_status', {
            chatUsrId: parmas.get('id'),
            status: true,
        });
    // handleInputBlur
    const handleInputBlur = () =>
        state.opened_socket?.emit('chatusr_typing_status', {
            chatUsrId: parmas.get('id'),
            status: false,
        });
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
                dispatch(addMessageToChat(message));
                // send message with web sockets
                state.opened_socket?.emit('send_msg', message);
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
            dispatch(addMessageToChat(message));
            // send message with web sockets
            state.opened_socket?.emit('send_msg', message);
            // clear the input
            setState({
                ...state,
                msgText: '',
            });
            return;
        }
    };
    // mark maessage as readed
    const markMessageAsReaded = (msgId: string, senderId: string) => {
        state.opened_socket?.emit('message_readed', { msgId, senderId });
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
        if (openedChat) {
            // load chat messages
            dispatch(
                getChatMessages(parmas.get('id')!) as unknown as AnyAction
            );
        }
        // // open websocket connection
        const socket = io(`${apiUrl}`, {
            query: { client_id: currentUsr },
        });
        // chatusr_start_typing
        socket.on('chatusr_typing_status', (status) =>
            dispatch(setChatUsrTyping(status))
        );
        // receive msg
        socket.on('message', (message: ChatMessage) => {
            socket.emit('message_delevered', {
                msgId: message._id,
                senderId: message.senderId,
            });
            // check if the msg releated to current chat
            if (message.senderId !== openedChat?.id) {
                return;
            }
            dispatch(addMessageToChat(message));
            playReceiveMessageSound();
        });
        // usr_online_status
        socket.on('usr_online_status', (data) => {
            if (parmas.get('id') === data.id) {
                dispatch(setChatUsrStatus(data.status));
            }
        });
        // on new chat create
        socket.on('chat_created', (chatId) => dispatch(setOpenedChat(chatId)));
        // receive message status
        socket.on(
            'message_status',
            (data: { msgId: string; status: MessageStatus }) => {
                dispatch(setMessageStatus(data));
                // check for message sent status
                if (data.status === MessageStatus.SENT) {
                    playSentMessageSound();
                }
            }
        );
        setState({
            ...state,
            opened_socket: socket,
        });
        // clean up when component unmount
        return function cleanUp() {
            dispatch(setOpenedChat(undefined));
        };
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
                    chatMessages!.map((msg) => (
                        <ChatMassage
                            messageData={msg}
                            key={Math.random()}
                            markMsgAsReaded={markMessageAsReaded}
                        />
                    ))
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
