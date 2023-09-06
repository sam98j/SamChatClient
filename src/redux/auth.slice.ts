import { loginUser, signUpApi } from '@/apis/auth.api';
import { getUserChats } from '@/apis/chats.api';
import {createSlice} from '@reduxjs/toolkit';

// loging success shape
// Login Successfly Response
export interface LoggedInUserData {
    _id: string,
    email: string,
    avatar: string,
    name: string,
    usrname?: string,
    chatId?: string
}


// state slice shape
export interface AuthState {
    currentUser: string | null | undefined,
    apiResMessage: {err: boolean, msg: string} | null
}

// logUserInSuccData
export interface LogUserInSuccData {
    access_token: string;
    user: LoggedInUserData
}
// inital state
const initialState: AuthState = {
    currentUser: null,
    apiResMessage: null
};

// create state slcie and export it
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('access_token');
            state.currentUser = undefined;
        },
        resetAuthApiRes: (state) => {
            state.apiResMessage = null;
        }
    },
    extraReducers: (builder) =>{
        builder.addCase(loginUser.fulfilled,  (state, action) => {
            const {access_token, user} = action.payload as LogUserInSuccData;
            // store the user access token in the localstorage
            localStorage.setItem('access_token', `Bearer ${access_token}`);
            state.currentUser =  user._id,
            state.apiResMessage = {err: false, msg: 'You Successfyl Logged In ...'};
        });
        builder.addCase(loginUser.rejected,  (state) => {
            state.currentUser =  '';
            state.apiResMessage = {err: true, msg: 'Some thing Went Wrong, Check You email or password'};
        });
        builder.addCase(getUserChats.fulfilled, (state, action) => {
            state.currentUser = action.payload.userId;
        });
        builder.addCase(getUserChats.rejected, (state) => {
            state.currentUser = undefined;
        });
        builder.addCase(signUpApi.fulfilled, (state, action) => {
            if(action.payload.message) {
                state.apiResMessage = {err: true, msg: action.payload.message};
                return;
            }
            state.currentUser = action.payload.user._id;
            localStorage.setItem('access_token', `Bearer ${action.payload.access_token}`);
        });
    },
});

export const {logout, resetAuthApiRes} = authSlice.actions;
// export the reducer function
export default authSlice.reducer;