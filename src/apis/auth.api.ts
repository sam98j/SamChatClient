import { createAsyncThunk } from "@reduxjs/toolkit";

// login User Api
export const loginUser = createAsyncThunk('loginUser', async (userCred: {email: string, password: string}, thunkAPI) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "Application/json",
        },
        body: JSON.stringify(userCred)
    })
    // check for internal serval error
    if(response.status >= 500) {
        return thunkAPI.rejectWithValue("Internal Server Error")
    }
    // if the login failed
    if(response.status >= 400) {
        return thunkAPI.rejectWithValue("Email Or Password is Not Correct!")
    }
    // there is no error
    return (await response).json()
})