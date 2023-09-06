import { createAsyncThunk } from '@reduxjs/toolkit';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getUsrProfileData = createAsyncThunk('getUsrProfileData', async (usrId: string, thunkAPI) => {
    const response = await fetch(`${apiUrl}/users/profile/${usrId}`, {
        method: 'GET',
        headers: {'authorization': localStorage.getItem('access_token')!,}
    });
    // check for internal serval error
    if(response.status >= 500) {
        return thunkAPI.rejectWithValue('Internal Server Error');
    }
    // if the login failed
    if(response.status >= 400) {
        return thunkAPI.rejectWithValue('usr not found');
    }
    // there is no error
    return (await response).json();
});