// TODO: finish
import { isRejected } from "@reduxjs/toolkit";
// import { redirect } from "react-router-dom";

const apiAuthentication = () => (next) => (action) => {
    if (isRejected(action) && action.payload?.originalStatus === 401) {
        console.log("Unauthenticated, must redirect to root");
    }

    return next(action);
}

export default apiAuthentication;