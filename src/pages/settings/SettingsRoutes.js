import * as React from "react";
import InfoPanel from "./panels/Info";
import WifiPanel from "./panels/Wifi";
import TimePanel from "./panels/Time";
import BackupPanel from "./panels/Backup";

const routes = [
    {
        path: "info",
        element: <InfoPanel />
    },
    {
        path: "wifi",
        element: <WifiPanel />
    },
    {
        path: "time",
        element: <TimePanel />
    },
    {
        path: "backup",
        element: <BackupPanel />
    }
];


export default routes;