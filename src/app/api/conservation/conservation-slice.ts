import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conservation } from "./conservation-type";
import { Message } from "../message/message-type";

const initialState: Conservation[] = [];

const conservationSlice = createSlice({
    name: 'conservations',
    initialState,
    reducers: {
        addConservations: (state, action: PayloadAction<Conservation[]>) => {
            const conservations = action.payload;
            state.push(...conservations);
        },
        addConservation: (state, action: PayloadAction<Conservation>) => {
            state.push(action.payload);
        },
        clearConservations: (state) => {
            state.length = 0;
        },
        updateLatestMsg: (state, action: PayloadAction<Message>) => {
            let conservation = state.find((conservation) => conservation.id === action.payload.conservation);

            if(conservation) {
                conservation.lastMessage = action.payload;
            }
        },
        increaseUnreadMessage: (state, action: PayloadAction<number>) => {
            let conservation = state.find((cons) => cons.id === action.payload);
            if(!conservation)
                return;

            conservation.unread += 1;
        },
        setEmptyUnreadMessage: (state, action: PayloadAction<number>) => {
            let conservation = state.find((cons) => cons.id === action.payload);
            if(!conservation)
                return;
            conservation.unread = 0;
        }
    }
}
)

export const { addConservation, addConservations, clearConservations, updateLatestMsg, increaseUnreadMessage, setEmptyUnreadMessage } = conservationSlice.actions;
export default conservationSlice.reducer;

export const getConservations = (state: any): Conservation[] => {
    return state.conservation;
}
