import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth/auth-slice';
import conservationReducer from './conservation/conservation-slice';
import { apiSlice } from "./base/api-slice";
import messageReducer from './message/message-slice';
import notificationReducer from './notification/notification-slice';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        conservation: conservationReducer,
        message: messageReducer,
        notification: notificationReducer
    },
    middleware: getDefaultMiddleware =>  getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true

})

export type RootState = ReturnType<typeof store.getState>