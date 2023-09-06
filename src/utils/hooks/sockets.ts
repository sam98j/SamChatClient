import { ChatMessage, MessageStatus } from '@/interfaces/chat.interface';
import { addMessageToChat, setChatUsrStatus, setChatUsrTyping, setMessageStatus, setOpenedChat } from '@/redux/chats.slice';
import { RootState } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { io , Socket} from 'socket.io-client';
import { playReceiveMessageSound, playSentMessageSound } from '../chat.util';
import { useSearchParams } from 'next/navigation';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const useSocketIo = () => {
    // search params
    const parmas = useSearchParams();
    // auth state
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    // chat state
    const {openedChat, isCurrentUsrTyping, chatMessages} = useSelector((state: RootState) => state.chat);
    // socket instance
    const [socketClient, setSocket] = useState<Socket | null>(null);
    // dispatch func
    const dispatch = useDispatch();
    useEffect(() => {
        // termenate if user is not available
        if(!currentUser) return;
        // // open websocket connection
        const socket = io(`${apiUrl}`, {
            query: { client_id: currentUser },
        });
        // set socket
        setSocket(socket);
        // chatusr_start_typing
        socket?.on('chatusr_typing_status', (status) => dispatch(setChatUsrTyping(status)));
        // receive msg
        socket?.on('message', (message: ChatMessage) => {
            socket.emit('message_delevered', {msgId: message._id, senderId: message.senderId,});
            // check if the msg releated to current chat
            if (message.senderId !== openedChat?.id) {return;}
            dispatch(addMessageToChat(message));
            playReceiveMessageSound();
        });
        // check for chat opend
  
        // usr_online_status
        socket?.on('usr_online_status', (data) => {
            if (parmas.get('id') === data.id) {
                dispatch(setChatUsrStatus(data.status));
            }
        });
        // on new chat create
        socket?.on('chat_created', (chatId) => dispatch(setOpenedChat(chatId)));
        // receive message status
        socket?.on(
            'message_status',
            (data: { msgId: string; status: MessageStatus }) => {

                dispatch(setMessageStatus(data));
                // check for message sent status
                if (data.status === MessageStatus.SENT) {
                    playSentMessageSound();
                }
            }
        );
    }, []);
    useEffect(() => {
        if(chatMessages?.length) {
            socketClient?.emit('send_msg', chatMessages[chatMessages.length - 1]);
        }
    }, [chatMessages]);
    useEffect(() => {
        if(parmas.get('id')){
            console.log('run');

            // send current user typing status
            socketClient?.emit('chatusr_typing_status', {chatUsrId: parmas.get('id'), status: isCurrentUsrTyping,});
        }
    }, [openedChat]);
    return {currentUser};
};