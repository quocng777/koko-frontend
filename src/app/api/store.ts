import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth/auth-slice';
import { apiSlice } from "./base/api-slice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer
    },
    middleware: getDefaultMiddleware =>  getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true

})