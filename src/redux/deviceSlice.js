import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    url: "http://192.168.0.108",
    authcode: "",
    is_connected: false,
    token: ""
}

const deviceSlice = createSlice({
    name: "device",
    initialState,
    reducers: {
        setUrlAndAuthCode(state, action) {
            state.url = action.payload.url;
            state.authcode = action.payload.authcode;
        },
        setToken(state, action) {
            state.is_connected = true;
            state.token = action.payload.token;
        },
        deleteToken(state) {
            state.is_connected = false;
            state.token = null;
        }
    }
});

export const { setUrlAndAuthCode, setToken, deleteToken } = deviceSlice.actions;
export default deviceSlice.reducer;