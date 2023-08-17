import { createAsyncThunk } from "@reduxjs/toolkit";

// login User Api
export const setSocketInstance = createAsyncThunk('setSocketInstance', (socket: any) => {
   return socket
})