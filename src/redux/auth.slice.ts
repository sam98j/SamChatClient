import { loginUser, signUpApi } from '@/apis/auth.api';
import { getUserChats } from '@/apis/chats.api';
import { createSlice } from '@reduxjs/toolkit';

// loging success shape
// Login Successfly Response
export interface LoggedInUserData {
  _id: string;
  email: string;
  avatar: string;
  name: string;
  usrname?: string;
  chatId?: string;
}
// state slice shape
export interface AuthState {
  currentUser: Pick<LoggedInUserData, '_id' | 'avatar' | 'name'> | null | undefined;
  apiResponse: { err: boolean; msg: string } | null;
  isOAuthActive: boolean;
}
// logUserInSuccData
export interface LogUserInSuccData {
  access_token: string;
  loggedInUser: Pick<LoggedInUserData, 'avatar' | '_id' | 'name'>;
}
// inital state
const initialState: AuthState = {
  currentUser: null,
  apiResponse: null,
  isOAuthActive: false,
};

// create state slcie and export it
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('access_token');
      state.currentUser = undefined;
      // clear chat from local storage
      localStorage.removeItem('chats');
    },
    resetAuthApiRes: (state) => {
      state.apiResponse = null;
    },
    setCurrentUser: (state, action) => (state.currentUser = action.payload),
    setOAuthActivationStatus: (state, action) => (state.isOAuthActive = action.payload),
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      const { access_token, loggedInUser } = action.payload as LogUserInSuccData;
      // store the user access token in the localstorage
      localStorage.setItem('access_token', `Bearer ${access_token}`);
      state.currentUser = loggedInUser;
      state.apiResponse = { err: false, msg: 'You Successfyl Logged In ...' };
    });
    builder.addCase(loginUser.rejected, (state) => {
      state.currentUser = undefined;
      state.apiResponse = { err: true, msg: 'Some thing Went Wrong, Check You email or password' };
    });
    builder.addCase(getUserChats.fulfilled, (state, action) => {
      state.currentUser = action.payload.loggedInUser;
    });
    builder.addCase(getUserChats.rejected, (state) => {
      state.currentUser = undefined;
    });
    builder.addCase(signUpApi.fulfilled, (state, action) => {
      if (action.payload.message) {
        state.apiResponse = { err: true, msg: action.payload.message };
        return;
      }
      state.currentUser = action.payload.loggedInUser._id;
      localStorage.setItem('access_token', `Bearer ${action.payload.access_token}`);
      state.apiResponse = { err: false, msg: 'You Successfyl singed In ...' };
    });
  },
});

export const { logout, resetAuthApiRes, setCurrentUser, setOAuthActivationStatus } = authSlice.actions;
// export the reducer function
export default authSlice.reducer;
