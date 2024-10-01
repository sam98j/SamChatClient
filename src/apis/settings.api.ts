import { createAsyncThunk } from '@reduxjs/toolkit';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// login User Api
export const getUserSettings = createAsyncThunk(
  'getUserSettings',
  async (access_token: string, thunkAPI) => {
    //   access_token
    // fetch request
    const response = await fetch(`${apiUrl}/users/settings`, {
      method: 'POST',
      headers: {
        authorization: access_token,
      },
    });
    // check for internal serval error
    if (response.status >= 500) {
      return thunkAPI.rejectWithValue('Internal Server Error');
    }
    // if the login failed
    if (response.status >= 400) {
      return thunkAPI.rejectWithValue('Email Or Password is Not Correct!');
    }
    // there is no error
    return (await response).json();
  },
);
