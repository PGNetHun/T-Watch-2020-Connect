import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from "redux-persist";
import deviceReducer from "./deviceSlice";
import appsReducer from "./appsSlice";
import facesReducer from "./facesSlice";
import callbackReducer from "./callbackSlice";
import tempStateReducer from "./tempStateSlice";
import { deviceApi } from "../api/deviceApi";
import { storeApi } from "../api/storeApi";
import apiToastify from "../middlewares/apiToastify"
import apiAuthentication from "../middlewares/apiAuthentication";

const rootReducer = combineReducers({
    device: deviceReducer,
    apps: appsReducer,
    faces: facesReducer,
    callback: callbackReducer,
    tempState: tempStateReducer,
    [deviceApi.reducerPath]: deviceApi.reducer,
    [storeApi.reducerPath]: storeApi.reducer,
});

const persistConfig = {
    key: "root",
    version: 1,
    storage,
    blacklist: ["deviceApi", "storeApi"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, "storeApi/executeQuery/fulfilled", "deviceApi/executeQuery/fulfilled"],
                ignoredActionPaths: ["meta.arg", "meta.baseQueryMeta"],
                ignoredPaths: ["storeApi.queries", "deviceApi.queries"]
            },
        })
            .concat(deviceApi.middleware)
            .concat(storeApi.middleware)
            .concat(apiAuthentication)
            .concat(apiToastify),
});