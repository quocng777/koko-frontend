import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "./message-type";
import { RootState } from "../store";

const initialState: Message[] = [];

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<Message>) => {
            state.push(action.payload);
        },

        addMessages: (state, action: PayloadAction<Message[]>) => {
            state.push(...action.payload);
        }
    }
});

export const { addMessage, addMessages } = messageSlice.actions;

export default messageSlice.reducer;

export const getMessage = (state: RootState, action: {consId: number, msgId: number}) => {
    return state.message.find((msg) => msg.conservation === action.consId && msg.id === action.msgId);
}