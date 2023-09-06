import { getUsrProfileData } from '@/apis/usrprofile.api';
import { createSlice } from '@reduxjs/toolkit';

// state interface
export interface UsrProileState {
    avatar: string;
    usrname: string;
    name: string
}

// inital state
const initState: {usrProfile: UsrProileState | null} = {
    usrProfile: null
};

// profile store slice
export const profileSlice = createSlice({
    name: 'usr_profile',
    initialState: initState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getUsrProfileData.fulfilled, (state, action) => {
            const usrProfileData = action.payload as UsrProileState;
            state.usrProfile = usrProfileData;
        });
    },
});

export default profileSlice.reducer;