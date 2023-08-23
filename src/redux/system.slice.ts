import { setSocketInstance } from '@/apis/systme.api';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';

// state slice shape
export interface SystemState {
    isNewChatScreenOpen: boolean,
    currentRoute: string,
    prefLanguage: string
}

// inital state
const initialState: SystemState = {
    isNewChatScreenOpen: false,
    currentRoute: "",
    prefLanguage: "en"
}

// create state slcie and export it
export const systemSlice = createSlice({
    name: "system",
    initialState,
    reducers: {
        changeNewChatScrStatus: (state, action) => {
            state.isNewChatScreenOpen = action.payload
        },
        setCurrentRoute: (state, action: PayloadAction<string>) => {state.currentRoute = action.payload},
        setLang: (state, action: PayloadAction<string>) => {state.prefLanguage = action.payload}
    },
})
export const {changeNewChatScrStatus, setCurrentRoute} = systemSlice.actions
// export the reducer function
export default systemSlice.reducer;