import * as React from "react";
import InstalledPanel from "./panels/Installed";
import SettingsPanel from "./panels/Settings";
import LauncherPanel from "./panels/Launcher";

const routes = [
    {
        path: "installed",
        element: <InstalledPanel />
    },
    {
        path: "settings/:name?/*",
        element: <SettingsPanel />
    },
    {
        path: "launcher/:name?/*",
        element: <LauncherPanel />
    }
];


export default routes;