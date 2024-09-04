import { GetChatMessagesRes } from '@/interfaces/chat.interface';
import { ChatProfile, SingleChat } from '@/redux/chats.slice';
import { createAsyncThunk } from '@reduxjs/toolkit';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// login User Api
export const getUserChats = createAsyncThunk('getUserChats', async (bearerToken: string | null, thunkAPI) => {
  // request parmas
  const requestInit = { method: 'GET', headers: { authorization: bearerToken } } as RequestInit;
  // fetch request
  const response = await fetch(`${apiUrl}/chats`, requestInit);
  // check for internal serval error
  if (response.status >= 500) {
    return thunkAPI.rejectWithValue('Internal Server Error');
  }
  // if the login failed
  if (response.status >= 400) {
    return thunkAPI.rejectWithValue('You Are Not Authente. Yet');
  }
  const resp = await response.json();
  // there is no error
  return resp;
});
// get chat's messages with specific usr
export const getChatMessages = createAsyncThunk(
  'getChatMessages',
  async (data: { chatId: string; msgBatch: number }, thunkAPI) => {
    const { chatId, msgBatch } = data;
    // access token
    const access_token = localStorage.getItem('access_token');
    const response = await fetch(`${apiUrl}/messages/getchatmessages/${chatId}?msgs_batch=${msgBatch}`, {
      method: 'GET',
      headers: {
        authorization: access_token,
      },
    } as RequestInit);
    // check for internal serval error
    if (response.status >= 500) {
      return thunkAPI.rejectWithValue('Internal Server Error');
    }
    // if the login failed
    if (response.status >= 400) {
      return thunkAPI.rejectWithValue('You Are Not Authente. Yet');
    }
    const resp = (await response.json()) as GetChatMessagesRes;
    // there is no error
    return resp;
  }
);
// get usr online status
export const getUsrOnlineStatus = createAsyncThunk('getUsrOnlineStatus', async (usrId: string, thunkAPI) => {
  // access token
  const access_token = localStorage.getItem('access_token');
  // get request
  const response = await fetch(`${apiUrl}/users/get_online_status/${usrId}`, {
    method: 'GET',
    headers: { authorization: access_token! },
  });
  // check for internal serval error
  if (response.status >= 500) {
    return thunkAPI.rejectWithValue('Internal Server Error');
  }
  // if the clinet err
  if (response.status >= 400) {
    return thunkAPI.rejectWithValue('You Are Not Authente. Yet');
  }
  const resp = (await response.text()) as string;
  // there is no error
  return resp;
});
// get chat profile
export const getChatProfile = createAsyncThunk('getChatProfile', async (chatId: string, thunkAPI) => {
  // access token
  const access_token = localStorage.getItem('access_token');
  // get request
  const response = await fetch(`${apiUrl}/chats/${chatId}`, {
    method: 'GET',
    headers: { authorization: access_token! },
  });
  // check for internal serval error
  if (response.status >= 500) {
    return thunkAPI.rejectWithValue('Internal Server Error');
  }
  // if the clinet err
  if (response.status >= 400) {
    return thunkAPI.rejectWithValue('You Are Not Authente. Yet');
  }
  const resp = (await response.json()) as SingleChat;
  // there is no error
  return resp;
});
// get chat profile
export const createChat = createAsyncThunk('createChat', async (chat: SingleChat, thunkAPI) => {
  // access token
  const access_token = localStorage.getItem('access_token');
  // get request
  const response = await fetch(`${apiUrl}/chats/create_chat`, {
    method: 'POST',
    headers: { authorization: access_token!, 'Content-type': 'application/json' },
    body: JSON.stringify(chat),
  });
  // check for internal serval error
  if (response.status >= 500) {
    return thunkAPI.rejectWithValue('Internal Server Error');
  }
  // if the clinet err
  if (response.status >= 400) {
    return thunkAPI.rejectWithValue('You Are Not Authente. Yet');
  }
  const resp = (await response.json()) as ChatProfile;
  // there is no error
  return resp;
});
// delete chat
export const deleteChat = createAsyncThunk('deleteChat', async (_id: string, thunkAPI) => {
  // access token
  const access_token = localStorage.getItem('access_token');
  // get request
  const response = await fetch(`${apiUrl}/chats/${_id}`, {
    method: 'Delete',
    headers: { authorization: access_token! },
  });
  // check for internal serval error
  if (response.status >= 500) {
    return thunkAPI.rejectWithValue('Internal Server Error');
  }
  // if the clinet err
  if (response.status >= 400) {
    return thunkAPI.rejectWithValue('You Are Not Authente. Yet');
  }
  const resp = (await response.json()) as ChatProfile;
  // there is no error
  return resp;
});
