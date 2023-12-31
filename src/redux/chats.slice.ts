import { getChatMessages, getChatProfile, getUserChats, getUsrOnlineStatus } from '@/apis/chats.api';
import { ChatMessage, ChatUserActions, MessageStatus } from '@/interfaces/chat.interface';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

// Single Chat
export interface SingleChat {
    usrid: string;
    usrname: string;
    avatar: string
}
// chat profile
export interface ChatProfile {
    avatar: string;
    name: string;
    email: string
}

// state slice shape
export interface ChatState {
    chats: SingleChat[] | null | undefined,
    chatMessages: ChatMessage[] | null,
    openedChat: {id: string, usrname: string} | null | undefined,
    isChatUsrDoingAction: {action: ChatUserActions | null, actionSender: string | null},
    isCurrentUsrDoingAction: null | ChatUserActions,
    chatUsrStatus: string,
    messageToBeMarketAsReaded: null | {msgId: string, senderId: string},
    messageToSent: null | ChatMessage,
    currentChatPorfile: null | ChatProfile
}

// inital state
const initialState: ChatState = {
    chats: null,
    chatMessages: [],
    openedChat: undefined,
    isChatUsrDoingAction: {action: null, actionSender: null},
    isCurrentUsrDoingAction: null,
    chatUsrStatus: '',
    messageToBeMarketAsReaded: null,
    messageToSent: null,
    currentChatPorfile: null
};

// create state slcie and export it
export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setOpenedChat: (state, action: PayloadAction<{id: string, usrname: string} | undefined>) => {
            const openedChat = action.payload;
            state.openedChat = openedChat;
        },
        // add message to the chat
        addMessageToChat: (state, action: PayloadAction<ChatMessage>) => {state.chatMessages?.push(action.payload);},
        // change chat user typing state
        setChatUsrDoingAction: (state, action: PayloadAction<{action: ChatUserActions, actionSender: string}>) => {
            state.isChatUsrDoingAction = action.payload;
        },
        // set chat usr status
        setChatUsrStatus: (state, action: PayloadAction<string>) => {state.chatUsrStatus = action.payload;},
        // change message status
        setMessageStatus: (state, action: PayloadAction<{msgId: string, status: MessageStatus}>) => {
            // get index of the message
            const msgIndex = state.chatMessages?.findIndex((msg) => msg._id === action.payload.msgId);
            // if msg dosnot exist termenate the process
            if(msgIndex === -1) return;
            state.chatMessages![msgIndex!].status = action.payload.status;
        },
        // set current usr typing state
        setCurrentUsrDoingAction(state, action: PayloadAction<null | ChatUserActions>){state.isCurrentUsrDoingAction = action.payload;},
        // messageToBeMarketAsReaded
        setMessageToBeMarketAsReaded(state, action: PayloadAction<{msgData: {msgId: string, senderId: string}}>){
            state.messageToBeMarketAsReaded = action.payload.msgData;
        },
        // set message to be sent
        setMessageToSent(state, action: PayloadAction<null | ChatMessage>){
            if(action.payload) {state.chatMessages?.push(action.payload);}
            state.messageToSent = action.payload;
        },
        // add new chat to the chats
        addNewChat(state, action: PayloadAction<SingleChat>){state.chats = [action.payload, ...state.chats!];},
        // place last update chat to the top
        placeLastUpdatedChatToTheTop(state, action: PayloadAction<{chatUsrId: string}>){
            state.chats?.find((chat, index) => {
                if(chat.usrid === action.payload.chatUsrId) {
                    const chatsFirstPart = state.chats?.slice(0, index);
                    const chatsSecondPart = state.chats?.slice(index + 1);
                    const updatedChat = state.chats?.slice(index, index + 1);
                    state.chats = Array.prototype.concat(updatedChat, chatsFirstPart, chatsSecondPart);
                }});
        }
    },
    extraReducers: (builder) =>{
        builder.addCase(getUserChats.fulfilled,  (state, action) => {
            const chats = action.payload.chats as [];
            state.chats =  chats,
            state.chatMessages = [];
        });
        builder.addCase(getChatMessages.fulfilled,  (state, action) => {
            const chatMessages = action.payload;
            state.chatMessages = chatMessages;
        });
        builder.addCase(getChatMessages.pending,  (state) => {state.chatMessages = null;});
        // get chat profile
        builder.addCase(getChatProfile.fulfilled, (state, action: PayloadAction<ChatProfile>) => {state.currentChatPorfile = action.payload;});
        // set usr online status
        builder.addCase(getUsrOnlineStatus.fulfilled, (state, action: PayloadAction<string>) => {state.chatUsrStatus = action.payload;});
    },
});
export const {
    setOpenedChat, addMessageToChat, setChatUsrDoingAction, setChatUsrStatus, setMessageStatus, setCurrentUsrDoingAction, setMessageToBeMarketAsReaded, setMessageToSent, addNewChat, placeLastUpdatedChatToTheTop} = chatSlice.actions;
// export the reducer function
export default chatSlice.reducer;