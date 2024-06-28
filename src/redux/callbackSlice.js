import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    "spotify": null
}

const callbackSlice = createSlice({
    name: "callback",
    initialState,
    reducers: {
        set(state, action) {
            state[action.payload.id] = action.payload.params;
        },
        remove(state, action) {
            state[action.payload] = null;
        }
    }
});

export const { set, remove } = callbackSlice.actions;
export default callbackSlice.reducer;