import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "./message-type";
import { RootState } from "../store";

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
            
            // check if there is an message existed in the store
            const msg = conservation.find((msg) => msg.id == action.payload.id);
            if(msg)
                return;
            else {
                conservation.push(action.payload);
            }

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
            const msgIdx = conservation.findIndex((msg) => msg.tempId == action.payload.tempId);
            if(msgIdx != -1) {
                conservation.splice(msgIdx, 1)
            }

            state[action.payload.conservation] = conservation;
        },
        updateLocalMessage: (state, action: PayloadAction<{ message: Message, tempId: string}>) => {
            const receivedMsg = action.payload.message;
            let conservation = state[action.payload.message.conservation];
 
            const msgIdx = conservation.findIndex((msg) => msg.tempId == action.payload.tempId);
            const storedMsg = conservation.find(msg => msg.id === action.payload.message.id)!;
            if(storedMsg) {
                conservation.splice(msgIdx, 1);
                return;
            }

            const msg = conservation[msgIdx];


            msg.id = receivedMsg.id;
            msg.attachments = receivedMsg.attachments;
            msg.createdAt = receivedMsg.createdAt;
            msg.message = receivedMsg.message;
            msg.hasError = undefined;
            msg.tempId = undefined;

        },
        addOldMessages: (state, action: PayloadAction<Message[]>) => {
            if(!action.payload || action.payload.length == 0)
                return;
            const conservationId = action.payload[0].conservation;
            const storedMessages = state[conservationId] ?? [];
            state[conservationId] = [...action.payload, ...storedMessages];
        }
    }
});

export const { addMessage, addMessages, addLocalMessage, deleteLocalMessage, updateLocalMessage, addOldMessages } = messageSlice.actions;

export default messageSlice.reducer;

export const getMessage = (state: RootState, action: {consId: number, msgId: number}) => {
    const conservation = state.message[action.consId];
    if(conservation) {
        return conservation.find(msg => msg.id == action.msgId);
    }
}