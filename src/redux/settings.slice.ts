import { getUserSettings } from '@/apis/settings.api';
import { createSlice } from '@reduxjs/toolkit';

// state slice shape
export interface SettingsState {
  pushNotificationsEnable: boolean;
}

// inital state
const initialState: SettingsState = {
  pushNotificationsEnable: false,
};

// create state slcie and export it
export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers(builder) {
    //   get usr settings
    builder.addCase(getUserSettings.fulfilled, (state, action) => {
      state.pushNotificationsEnable = action.payload.pushNotifications;
    });
  },
});
// export the reducer function
export default settingsSlice.reducer;
