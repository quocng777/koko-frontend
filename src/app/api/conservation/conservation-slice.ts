import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conservation } from "./conservation-type";
import { RootState } from "../store";

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
        }
    }
}
)

export const { addConservation, addConservations, clearConservations } = conservationSlice.actions;
export default conservationSlice.reducer;

export const getConservations = (state: any): Conservation[] => {
    return state.conservation;
}
