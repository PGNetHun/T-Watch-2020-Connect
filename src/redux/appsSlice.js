import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    installed: [],
    available: []
}

const appsSlice = createSlice({
    name: "apps",
    initialState,
    reducers: {
        setInstalled(state, action) {
            state.installed = action.payload;
        },
        addInstalled(state, action) {
            state.installed.push(action.payload);
            state.installed.sort();
        },
        removeInstalled(state, action) {
            const name = action.payload;
            const index = state.installed.indexOf(name);
            if (index >= 0) {
                state.installed.splice(index, 1);
            }
        },
        setAvailable(state, action) {
            state.available = action.payload.available;
        },
    }
});

export const { setInstalled, addInstalled, removeInstalled, setAvailable } = appsSlice.actions;
export default appsSlice.reducer;