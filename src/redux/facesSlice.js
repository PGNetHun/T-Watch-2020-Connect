import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    installed: [],
    available: [],
    configurations: {}
}

const facesSlice = createSlice({
    name: "faces",
    initialState,
    reducers: {
        setInstalled(state, action) {
            state.installed = action.payload;
        },
        addInstalled(state, action) {
            const name = action.payload;
            state.installed.push(name);
            state.installed.sort();
            state.configurations[name] = {}
        },
        removeInstalled(state, action) {
            const name = action.payload;
            const index = state.installed.indexOf(name);
            if (index >= 0) {
                state.installed.splice(index, 1);
            }
            delete state.configurations[name];
        },
        setAvailable(state, action) {
            state.available = action.payload.available;
        },
        setConfiguration(state, action) {
            const { name, configuration } = action.payload;
            state.configurations[name] = configuration
        },
        getConfiguration(state, action) {
            const name = action.payload;
            return name in state.configurations ? state.configurations[name] : null;
        }
    }
});

export const { setInstalled, addInstalled, removeInstalled, setAvailable, setConfiguration, getConfiguration } = facesSlice.actions;
export default facesSlice.reducer;