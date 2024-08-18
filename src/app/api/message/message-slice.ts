import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "./message-type";
import { RootState } from "../store";
import { act } from "react";

const initialState: {[conservation: number]: Message[]} = {};

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<Message>) => {
            let conservation = state[action.payload.conservation];
            if(!conservation) {
                conservation = [];
            }
            conservation.push(action.payload);

            state[action.payload.conservation] = conservation;
        },

        addLocalMessage: ( state, action: PayloadAction<Message> ) => {
            let conservation = state[action.payload.conservation];
            if(!conservation) {
                conservation = [];
            }
            conservation.push(action.payload);

            state[action.payload.conservation] = conservation;
        },

        addMessages: (state, action: PayloadAction<Message[]>) => {
            // action.payload.forEach(msg => {
            //     const savedMsg = state.find((elm) => elm.id == msg.id);
            //     if(!savedMsg) {
            //         state.push(msg);
            //     }
            // })
        },

        deleteLocalMessage: (state, action: PayloadAction<{conservation: number, tempId: string}>) => {
            let conservation = state[action.payload.conservation];
            if(!conservation)
                return;
            const msgIdx = conservation.findIndex((msg) => msg.tempId as string == action.payload.tempId);
            if(msgIdx != -1) {
                conservation.splice(msgIdx, 1)
            }

            state[action.payload.conservation] = conservation;
        }
    }
});

export const { addMessage, addMessages, addLocalMessage, deleteLocalMessage } = messageSlice.actions;

export default messageSlice.reducer;

export const getMessage = (state: RootState, action: {consId: number, msgId: number}) => {
    const conservation = state.message[action.consId];
    if(conservation) {
        return conservation.find(msg => msg.id == action.msgId);
    }
}