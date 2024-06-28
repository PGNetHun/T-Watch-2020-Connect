import { isRejected } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';

const apiToastify = () => (next) => (action) => {
    if (isRejected(action)) {
        toast.error(action.payload?.data || "Device communication failure!");
    }

    return next(action);
}

export default apiToastify;