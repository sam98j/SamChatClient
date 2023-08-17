import { setSocketInstance } from '@/apis/systme.api';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';

// state slice shape
export interface SystemState {
    isNewChatScreenOpen: boolean,
}

// inital state
const initialState: SystemState = {
    isNewChatScreenOpen: false
}

// create state slcie and export it
export const systemSlice = createSlice({
    name: "system",
    initialState,
    reducers: {
        changeNewChatScrStatus: (state, action) => {
            state.isNewChatScreenOpen = action.payload
        }
    },
})
export const {changeNewChatScrStatus} = systemSlice.actions
// export the reducer function
export default systemSlice.reducer;