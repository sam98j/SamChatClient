import { getUsrProfileData, updateUsrProfileData } from '@/apis/usrprofile.api';
import { createSlice } from '@reduxjs/toolkit';

// current usr profile
export interface LoggedInUsrProfile {
  _id: string;
  usrname: string;
  email: string;
  avatar: string;
  name: string;
}

interface ProfileDataFieldUpdatingStatus {
  err: boolean;
  msg: string | null;
}

// inital state
const initState: {
  usrProfile: LoggedInUsrProfile | null;
  profileDataFieldUpdatingStatus: ProfileDataFieldUpdatingStatus | null;
} = {
  usrProfile: null,
  profileDataFieldUpdatingStatus: null,
};

// profile store slice
export const profileSlice = createSlice({
  name: 'usr_profile',
  initialState: initState,
  reducers: {
    setProfileFieldUpdateStatus(state) {
      state.profileDataFieldUpdatingStatus = null;
    },
  },
  extraReducers(builder) {
    // get usr profile succ
    builder.addCase(getUsrProfileData.fulfilled, (state, action) => {
      const usrProfileData = action.payload as LoggedInUsrProfile;
      state.usrProfile = usrProfileData;
    });
    // update usr profile succ
    builder.addCase(updateUsrProfileData.fulfilled, (state) => {
      state.profileDataFieldUpdatingStatus = { err: false, msg: null };
    });
    // update usr profile rejected
    builder.addCase(updateUsrProfileData.rejected, (state, action) => {
      const profileDataFieldUpdatingRejected = action.payload as string;
      state.profileDataFieldUpdatingStatus = { err: true, msg: profileDataFieldUpdatingRejected };
    });
  },
});
export const { setProfileFieldUpdateStatus } = profileSlice.actions;
export default profileSlice.reducer;
