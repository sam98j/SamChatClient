import {configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import authReducer from './auth.slice';
import systemReducer from './system.slice';
import chatReducer from './chats.slice';
import profieReducer from './profile.slice';

// create and configure redux store 
export const store = configureStore({
    reducer: {
        auth: authReducer,
        system: systemReducer,
        chat: chatReducer,
        usrProfile: profieReducer
    }
});

export type RootState = ReturnType<typeof store.getState>

// making nextjs wrapper
const makeStore = () => store;

// export wrapper
export const wrapper = createWrapper(makeStore);