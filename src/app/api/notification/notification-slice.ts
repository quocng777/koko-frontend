import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserNotification = {
    numNotification: number,
}

const initialState: UserNotification = {
    numNotification: 0
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNumNotification: (state, action: PayloadAction<number>) => {
            state.numNotification = action.payload;
        },
        increaseNotification: (state, action: PayloadAction<void>) => {
            state.numNotification += 1;
        }
    }
});

export const { setNumNotification, increaseNotification } = notificationSlice.actions;
export default notificationSlice.reducer;