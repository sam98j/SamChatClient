import {
  addChatMembers,
  createChat,
  getChatMessages,
  getChatProfile,
  getUserChats,
  getUsrOnlineStatus,
} from '@/apis/chats.api';
import {
  ChangeMessageStatusDTO,
  ChatMessage,
  ChatActionsTypes,
} from '@/interfaces/chat.interface';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { LoggedInUserData } from './auth.slice';

// Single Chat
// Chat's Types
export enum ChatTypes {
  'INDIVISUAL' = 'INDIVISUAL',
  'GROUP' = 'GROUP',
}
// chat card
export interface ChatCard extends SingleChat {
  lastMessage: Omit<ChatMessage, 'fileSize'>;
  unReadedMsgs: number;
}
// Chat's Member
export type ChatMember = Pick<LoggedInUserData, '_id' | 'avatar' | 'name'>;
// Chat
export interface SingleChat {
  _id: string;
  name: string;
  avatar: string;
  type: ChatTypes;
  members: ChatMember[];
}
// chat profile
export interface ChatProfile {
  avatar: string;
  name: string;
  email: string;
}
// chatActionsDTO
export interface ChatActions {
  type: ChatActionsTypes | null;
  senderId: string;
  chatId: string;
  chatMembers: string[];
}
// responseToMessageData
export type ResponseToMessageData = Pick<
  ChatMessage,
  'sender' | 'content' | 'type' | '_id' | 'voiceNoteDuration' | 'fileName'
>;
export type MessagesToBeForwarded = {
  messages: string[];
  chats: string[];
};
// state slice shape
export interface ChatState {
  chats: ChatCard[] | null | undefined;
  chatMessages: ChatMessage[] | null;
  isLastChatMessagesBatch: boolean | null;
  openedChat: SingleChat | null | undefined;
  isChatUsrDoingAction: ChatActions;
  isCurrentUsrDoingAction: ChatActions;
  chatUsrStatus: string | null | undefined;
  messageToBeMarketAsReaded: null | ChangeMessageStatusDTO;
  currentChatPorfile: null | ChatProfile;
  chatMessagesBatchNo: number;
  aggreUnRededMsgs: number;
  fileMessageUploadIndicator: number | null;
  addChatMembersRes: boolean | null;
  responseToMessage: ResponseToMessageData | null;
  messagesToBeForwared: MessagesToBeForwarded | null;
  createChatAPIres: null | boolean;
}
// inital state
const initialState: ChatState = {
  fileMessageUploadIndicator: null,
  messagesToBeForwared: null,
  createChatAPIres: null,
  isLastChatMessagesBatch: null,
  addChatMembersRes: null,
  responseToMessage: null,
  chats: null,
  chatMessages: [],
  openedChat: undefined,
  isChatUsrDoingAction: {
    chatId: '',
    chatMembers: [],
    senderId: '',
    type: null,
  },
  isCurrentUsrDoingAction: {
    chatId: '',
    chatMembers: [],
    senderId: '',
    type: null,
  },
  chatUsrStatus: '',
  messageToBeMarketAsReaded: null,
  currentChatPorfile: null,
  chatMessagesBatchNo: 1,
  aggreUnRededMsgs: 0,
};

// create state slcie and export it
export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setOpenedChat: (state, action: PayloadAction<SingleChat | undefined>) => {
      const openedChat = action.payload;
      state.openedChat = openedChat;
    },
    // set usr online statues
    setChatUserStatus: (state, action) => {
      state.chatUsrStatus = action.payload;
    },
    // change chat user typing state
    setChatUsrDoingAction: (state, action: PayloadAction<ChatActions>) => {
      state.isChatUsrDoingAction = action.payload;
    },
    // set chat usr status
    setChatUsrStatus: (
      state,
      action: PayloadAction<string | null | undefined>,
    ) => {
      state.chatUsrStatus = action.payload;
    },
    // change message status
    setMessageStatus: (
      state,
      action: PayloadAction<ChangeMessageStatusDTO>,
    ) => {
      // change message's status in chatCard's lastMessage
      const updateChats = state.chats?.map((chat) => {
        if (chat._id === action.payload.chatId) {
          return {
            ...chat,
            lastMessage: {
              ...chat.lastMessage,
              status: action.payload.msgStatus,
            },
          };
        }
        return chat;
      });
      // set chats
      state.chats = updateChats;
      // break if no opened chat
      if (!state.openedChat) return;
      // get index of the message
      if (!state.chatMessages) return;
      // change messages status
      action.payload.msgIDs.map((msgId) => {
        const msgIndex = state.chatMessages?.findIndex(
          (msg) => msg._id === msgId,
        );
        state.chatMessages![msgIndex!].status = action.payload.msgStatus;
      });
    },
    // set current usr typing state
    setCurrentUsrDoingAction(state, action: PayloadAction<ChatActions>) {
      state.isCurrentUsrDoingAction = action.payload;
    },
    // messageToBeMarketAsReaded
    setMessageToBeMarketAsReaded(
      state,
      action: PayloadAction<ChangeMessageStatusDTO>,
    ) {
      state.messageToBeMarketAsReaded = action.payload;
    },
    // add new chat to the chats
    addNewChat(state, action: PayloadAction<ChatCard>) {
      state.chats = [action.payload, ...state.chats!];
    },
    // place last update chat to the top
    placeLastUpdatedChatToTheTop(
      state,
      action: PayloadAction<{ chatId: string }>,
    ) {
      // get updated chat id
      state.chats?.find((chat, index) => {
        if (chat._id === action.payload.chatId) {
          const chatsFirstPart = state.chats?.slice(0, index);
          const chatsSecondPart = state.chats?.slice(index + 1);
          const updatedChat = state.chats?.slice(index, index + 1);
          state.chats = Array.prototype.concat(
            updatedChat,
            chatsFirstPart,
            chatsSecondPart,
          );
        }
      });
    },
    // search for chat
    searchForChat(state, action: PayloadAction<string>) {
      // get cached chats from local storage
      const cachedChats = localStorage.getItem('chats');
      // termenate if there is no cached chats
      if (cachedChats === null) return;
      // parsed cached chats
      const parsedCachedChats = JSON.parse(cachedChats) as ChatCard[];
      // create regex
      const regex = new RegExp(action.payload, 'i');
      // filter chats
      const fillteredChats = parsedCachedChats.filter(({ name }) =>
        regex.test(name),
      );
      // update chats state
      state.chats = fillteredChats;
      // if there is no query
      if (action.payload === '') state.chats = parsedCachedChats;
    },
    // set chat messages batch no
    setChatMessagesBatchNo: (state, action: PayloadAction<number>) => {
      state.chatMessagesBatchNo = action.payload;
    },
    // add Message To Chat
    addMessageToChat: (state, action: PayloadAction<ChatMessage>) => {
      // terminate if no message
      if (!action.payload) return;
      // check if message is already in chat
      const msgToRender = state.chatMessages?.filter(
        (msg) => msg._id === action.payload?._id,
      )[0];
      // terminate if msg exist
      if (msgToRender) return;
      // push message to chat
      state.chatMessages?.push(action.payload);
    },
    // set aggreated un readed message
    clearAggreUnReadedMsg: (
      state,
      action: PayloadAction<{ chatId: string }>,
    ) => {
      // updatedChat
      const updatedChats = state.chats?.map((chat) => {
        if (chat._id === action.payload.chatId) {
          return { ...chat, unReadedMsgs: 0 };
        }
        return chat;
      });
      // terminate if no chats
      state.chats = updatedChats;
    },
    // setChatLastMessage
    setChatLastMessage: (
      state,
      action: PayloadAction<{ msg: ChatMessage; currentUserId: string }>,
    ) => {
      // new message
      const lastMessage = action.payload.msg;
      // updatedChat
      const updatedChats = state.chats!.map((chat) => {
        if (chat._id === lastMessage.receiverId) {
          return { ...chat, lastMessage };
        }
        return chat;
      });
      // terminate if no chats
      state.chats = updatedChats;
    },
    // setChatUnReadedMessagesCount
    setChatUnReadedMessagesCount: (
      state,
      action: PayloadAction<{ msg: ChatMessage }>,
    ) => {
      // find update chat's index
      const chatIndex = state.chats?.findIndex(
        (chat) => chat._id === action.payload.msg.receiverId,
      );
      // old chat's unreaded messages
      const oldChatUnReadedMessaegs = state.chats![chatIndex!].unReadedMsgs;
      state.chats![chatIndex!].unReadedMsgs = oldChatUnReadedMessaegs + 1;
    },
    // setFileMessageUploadIndicator
    setFileMessageUploadIndicator: (state, action) => {
      console.log(action.payload);
      state.fileMessageUploadIndicator = action.payload;
    },
    // clear chat messages
    clearChatMessages: (state) => {
      state.chatMessages = [];
    },
    // set response to message
    setResponseToMessage: (
      state,
      action: PayloadAction<ResponseToMessageData | null>,
    ) => {
      state.responseToMessage = action.payload;
    },
    // forwardMsgMenu
    setMessagesToBeForwared(
      state,
      action: PayloadAction<MessagesToBeForwarded | null>,
    ) {
      state.messagesToBeForwared = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserChats.fulfilled, (state, action) => {
      const chats = action.payload.chats as ChatCard[];
      // sorted Chats
      const sortedChats = chats.sort((a, b) => {
        return (
          new Date(b.lastMessage.date).getTime() -
          new Date(a.lastMessage.date).getTime()
        );
      });
      // store user chats in local storage
      localStorage.setItem('chats', JSON.stringify(chats));
      // cached chats is null
      state.chats = sortedChats;
      state.chatMessages = [];
    });
    builder.addCase(getChatMessages.fulfilled, (state, action) => {
      const { chatMessages, isLastBatch } = action.payload;
      state.isLastChatMessagesBatch = isLastBatch;
      state.chatMessages = chatMessages;
    });
    builder.addCase(getChatMessages.pending, (state) => {
      state.chatMessages = null;
    });
    // get chat profile
    builder.addCase(
      getChatProfile.fulfilled,
      (state, action: PayloadAction<SingleChat>) => {
        state.openedChat = action.payload;
      },
    );
    // set usr online status
    builder.addCase(
      getUsrOnlineStatus.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.chatUsrStatus = action.payload;
      },
    );
    // create chat group
    builder.addCase(createChat.fulfilled, (state, action) => {
      const res = action.payload;
      state.createChatAPIres = res;
      console.log(res);
    });
    // adding members to a groub chat
    builder.addCase(addChatMembers.fulfilled, (state) => {
      state.addChatMembersRes = true;
    });
  },
});

export const {
  setOpenedChat,
  setChatUsrDoingAction,
  setChatUsrStatus,
  clearChatMessages,
  setChatUnReadedMessagesCount,
  setChatLastMessage,
  setMessagesToBeForwared,
  setMessageStatus,
  setResponseToMessage,
  clearAggreUnReadedMsg,
  setCurrentUsrDoingAction,
  setMessageToBeMarketAsReaded,
  addNewChat,
  setChatUserStatus,
  addMessageToChat,
  placeLastUpdatedChatToTheTop,
  searchForChat,
  setFileMessageUploadIndicator,
  setChatMessagesBatchNo,
} = chatSlice.actions;
// export the reducer function
export default chatSlice.reducer;
