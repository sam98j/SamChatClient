import { ChatMessage } from '@/interfaces/chat.interface';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// state slice shape
export interface SystemState {
  isNewChatScreenOpen: boolean;
  currentRoute: string;
  prefLanguage: string;
  newIncomingMsg: ChatMessage | null;
  attchFileMenuOpen: boolean;
}

// inital state
const initialState: SystemState = {
  isNewChatScreenOpen: false,
  currentRoute: '',
  prefLanguage: 'en',
  newIncomingMsg: null,
  attchFileMenuOpen: false,
};

// create state slcie and export it
export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    changeNewChatScrStatus: (state, action) => {
      state.isNewChatScreenOpen = action.payload;
    },
    setCurrentRoute: (state, action: PayloadAction<string>) => {
      state.currentRoute = action.payload;
    },
    setLang: (state, action: PayloadAction<string>) => {
      state.prefLanguage = action.payload;
    },
    setNewIncomingMsg(state, action: PayloadAction<ChatMessage>) {
      state.newIncomingMsg = action.payload;
    },
    setAttchFileMenuOpen(state, action: PayloadAction<boolean>) {
      state.attchFileMenuOpen = action.payload;
    },
  },
});
export const { changeNewChatScrStatus, setCurrentRoute, setNewIncomingMsg, setAttchFileMenuOpen } = systemSlice.actions;
// export the reducer function
export default systemSlice.reducer;
