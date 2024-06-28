import { createSlice } from "@reduxjs/toolkit";

const initialState = {}

const tempStateSlice = createSlice({
    name: "tempState",
    initialState,
    reducers: {
        set(state, action) {
            state[action.payload.id] = action.payload.data;
        },
        remove(state, action) {
            state[action.payload] = null;
        }
    }
});

export const { set, remove } = tempStateSlice.actions;
export default tempStateSlice.reducer;