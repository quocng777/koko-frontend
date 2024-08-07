import { createSlice } from "@reduxjs/toolkit";
import { User } from "../user/user-type";

type AuthState = {
    user: User | null
}

const initialState: AuthState = {
    user: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthenticatedUser: (state, action) => {
            const user = action.payload;
            console.log(user);
            state.user = user;
        },
        logOut: (state) => {
            state.user = null;
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        },
        renewToken: () => {}
    }
});

export const { setAuthenticatedUser, logOut, renewToken } = authSlice.actions;

export default authSlice.reducer;

export const getCurrentUser = (state: any) => state.auth.user;