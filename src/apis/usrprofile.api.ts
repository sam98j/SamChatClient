import { createAsyncThunk } from '@reduxjs/toolkit';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// get usr profile data
export const getUsrProfileData = createAsyncThunk('getUsrProfileData', async (usrId: string, thunkAPI) => {
  const response = await fetch(`${apiUrl}/users/profile/${usrId}`, {
    method: 'GET',
    headers: { authorization: localStorage.getItem('access_token')! },
  });
  // check for internal serval error
  if (response.status >= 500) {
    return thunkAPI.rejectWithValue('Internal Server Error');
  }
  // if the login failed
  if (response.status >= 400) {
    return thunkAPI.rejectWithValue('usr not found');
  }
  // there is no error
  return (await response).json();
});
// update profile data
export const updateUsrProfileData = createAsyncThunk(
  'UpdateUsrProfileData',
  async (profileField: { field: string; value: string }, thunkAPI) => {
    // update profile query
    const query = `?fieldname=${profileField.field}&value=${profileField.value}`;
    // request
    const response = await fetch(`${apiUrl}/users/profile${query}`, {
      method: 'PUT',
      headers: { authorization: localStorage.getItem('access_token')! },
    });
    // // update  response
    const updateRes = await response.json();
    // check for internal serval error
    if (response.status >= 500) {
      return thunkAPI.rejectWithValue('Internal Server Error');
    }
    // if the login failed
    if (updateRes.status === 400) {
      return thunkAPI.rejectWithValue('error');
    }
    // there is no error
    return updateRes;
  }
);
