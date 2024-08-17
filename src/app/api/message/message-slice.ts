import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "./message-type";
import { RootState } from "../store";

const initialState: Message[] = [];

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<Message>) => {
            const msg = state.find((msg) => msg.id == action.payload.id);
            if(!msg) {
                state.push(action.payload);
            }
        },

        addLocalMessage: ( state, action: PayloadAction<Message> ) => {
            state.push(action.payload);
        },

        addMessages: (state, action: PayloadAction<Message[]>) => {
            action.payload.forEach(msg => {
                const savedMsg = state.find((elm) => elm.id == msg.id);
                if(!savedMsg) {
                    state.push(msg);
                }
            })
        },

        deleteLocalMessage: (state, action: PayloadAction<string>) => {
            const msgIdx = state.findIndex((msg) => msg.tempId as string == action.payload);
            if(msgIdx != -1) {
                state.splice(msgIdx, 1)
            }
        }
    }
});

export const { addMessage, addMessages, addLocalMessage, deleteLocalMessage } = messageSlice.actions;

export default messageSlice.reducer;

export const getMessage = (state: RootState, action: {consId: number, msgId: number}) => {
    return state.message.find((msg) => msg.conservation === action.consId && msg.id === action.msgId);
}