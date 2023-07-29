import { loginUser } from '@/apis/auth.api';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

// loging success shape
// Login Successfly Response
export interface LoggedInUserData {
    _id: string,
    email: string,
    avatar: string,
    name: string,
}


// state slice shape
export interface AuthState {
    currentUser: LoggedInUserData | null | undefined,
    apiResMessage: {err: boolean, msg: string} | null
}

// logUserInSuccData
export interface LogUserInSuccData {
    access_token: string;
    user: LoggedInUserData
}
// inital state
const initialState: AuthState = {
    currentUser: undefined,
    apiResMessage: null
}

// create state slcie and export it
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) =>{
        builder.addCase(loginUser.pending,  (state, action) => {
            state.currentUser =  null
        })
        builder.addCase(loginUser.fulfilled,  (state, action) => {
            const {access_token, user} = action.payload as LogUserInSuccData;
            (function storeUserAccessToken(){
                // store the user access token in the localstorage
                localStorage.setItem('access_token', JSON.stringify(access_token))
            })()
            state.currentUser =  user,
            state.apiResMessage = {err: false, msg: 'You Successfyl Logged In ...'}
        })
        builder.addCase(loginUser.rejected,  (state, action) => {
            state.currentUser =  undefined;
            state.apiResMessage = {err: true, msg: "Some thing Went Wrong, Check You email or password"}
        })
    },
})

// export the reducer function
export default authSlice.reducer;