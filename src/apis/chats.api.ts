import { ChatMessage } from '@/interfaces/chat.interface';
import { createAsyncThunk } from '@reduxjs/toolkit';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// login User Api
export const getUserChats = createAsyncThunk('getUserChats', async (bearerToken: string | null, thunkAPI) => {
    const response = await fetch(`${apiUrl}/messages/chats`, {
        method: 'GET',
        headers: {
            authorization: bearerToken
        },
    } as RequestInit);
    // check for internal serval error
    if(response.status >= 500) {
        return thunkAPI.rejectWithValue('Internal Server Error');
    }
    // if the login failed
    if(response.status >= 400) {
        return thunkAPI.rejectWithValue('You Are Not Authente. Yet');
    }
    const resp = await response.json();
    // there is no error
    return resp;
});
// get chat's messages with specific usr
export const getChatMessages = createAsyncThunk('getChatMessages', async(chatUsrId: string, thunkAPI) => {
    // access token
    const access_token = localStorage.getItem('access_token');
    const response = await fetch(`${apiUrl}/messages/getchatmessages/${chatUsrId}`, {
        method: 'GET',
        headers: {
            authorization: access_token
        },
    } as RequestInit);
    // check for internal serval error
    if(response.status >= 500) {
        return thunkAPI.rejectWithValue('Internal Server Error');
    }
    // if the login failed
    if(response.status >= 400) {
        return thunkAPI.rejectWithValue('You Are Not Authente. Yet');
    }
    const resp = await response.json() as ChatMessage[];
    // there is no error
    return resp;
});
// get usr online status
export const getUsrOnlineStatus = createAsyncThunk('getUsrOnlineStatus', async(usrId: string, thunkAPI) => {
    // access token
    const access_token = localStorage.getItem('access_token');
    // get request
    const response = await fetch(`${apiUrl}/users/get_online_status/${usrId}`, {
        method: 'GET',
        headers: {authorization: access_token!}
    });
    // check for internal serval error
    if(response.status >= 500) {
        return thunkAPI.rejectWithValue('Internal Server Error');
    }
    // if the clinet err
    if(response.status >= 400) {
        return thunkAPI.rejectWithValue('You Are Not Authente. Yet');
    }
    const resp = await response.text() as string;
    // there is no error
    return resp;
});