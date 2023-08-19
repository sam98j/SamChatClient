import { getChatMessages, getUserChats, getUsrOnlineStatus } from '@/apis/chats.api';
import { ChatMessage, MessageStatus } from '@/pages/chat/chat.interface';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

// Single Chat
export interface SingleChat {
    chatId: string;
    chatWith: {
        usrid: string;
        usrname: string
    };
    lastMessage: {
        date: string;
        text: string
    };
    unReadedMessages: number;
    chatMessages: ChatMessage[]
}

// state slice shape
export interface ChatState {
    chats: SingleChat[] | null,
    chatMessages: ChatMessage[],
    openedChat: {id: string, usrname: string} | null | undefined,
    isChatUsrTyping: boolean,
    chatUsrStatus: string
}

// inital state
const initialState: ChatState = {
    chats: null,
    chatMessages: [],
    openedChat: undefined,
    isChatUsrTyping: false,
    chatUsrStatus: ""
}

// create state slcie and export it
export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setOpenedChat: (state, action: PayloadAction<{id: string, usrname: string} | undefined>) => {
            const openedChat = action.payload
            state.openedChat = openedChat
        },
        // add message to the chat
        addMessageToChat: (state, action: PayloadAction<ChatMessage>) => {state.chatMessages.push(action.payload)},
        // change chat user typing state
        setChatUsrTyping: (state, action: PayloadAction<boolean>) => {state.isChatUsrTyping = action.payload},
        // set chat usr status
        setChatUsrStatus: (state, action: PayloadAction<string>) => {state.chatUsrStatus = action.payload},
        // change message status
        setMessageStatus: (state, action: PayloadAction<{msgId: string, status: MessageStatus}>) => {
            // get index of the message
            const msgIndex = state.chatMessages.findIndex((msg) => msg._id === action.payload.msgId);
            state.chatMessages[msgIndex].status = action.payload.status
        }
    },
    extraReducers: (builder) =>{
        builder.addCase(getUserChats.fulfilled,  (state, action) => {
            const chats = action.payload.chats as [];
            state.chats =  chats,
            state.chatMessages = []
        })
        builder.addCase(getChatMessages.fulfilled,  (state, action) => {
            const chatMessages = action.payload;
            state.chatMessages = chatMessages
        })
        // set usr online status
        builder.addCase(getUsrOnlineStatus.fulfilled, (state, action: PayloadAction<string>) => {state.chatUsrStatus = action.payload})
    },
})
export const {setOpenedChat, addMessageToChat, setChatUsrTyping, setChatUsrStatus, setMessageStatus} = chatSlice.actions
// export the reducer function
export default chatSlice.reducer;