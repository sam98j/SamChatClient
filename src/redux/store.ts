import {configureStore} from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper';
import authReducer from './auth.slice';

// create and configure redux store 
export const store = configureStore({
    reducer: {
        auth: authReducer
    }
})

export type RootState = ReturnType<typeof store.getState>

// making nextjs wrapper
const makeStore = () => store;

// export wrapper
export const wrapper = createWrapper(makeStore);