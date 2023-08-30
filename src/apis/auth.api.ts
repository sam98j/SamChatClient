import { SignUpDto } from '@/interfaces/auth.interface';
import { createAsyncThunk } from '@reduxjs/toolkit';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// login User Api
export const loginUser = createAsyncThunk('loginUser', async (userCred: {email: string, password: string}, thunkAPI) => {
    const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json',
        },
        body: JSON.stringify(userCred)
    });
    // check for internal serval error
    if(response.status >= 500) {
        return thunkAPI.rejectWithValue('Internal Server Error');
    }
    // if the login failed
    if(response.status >= 400) {
        return thunkAPI.rejectWithValue('Email Or Password is Not Correct!');
    }
    // there is no error
    return (await response).json();
});

export const signUpApi = createAsyncThunk('signupUser',async (user: SignUpDto, thunkAPI) => {
    const res = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST', 
        headers: {'Content-type': 'Application/json'}, 
        body: JSON.stringify(user)
    });
    // check for server error
    if(res.status >= 500){
        return thunkAPI.rejectWithValue('Server Erro');
    }
    // check for client error
    if(res.status >= 400){
        return thunkAPI.rejectWithValue('client err');
    }
    return await res.json();
});