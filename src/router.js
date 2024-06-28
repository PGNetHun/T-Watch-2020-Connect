import * as React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import Authentication from "./pages/authentication/Authentication"
import Callback from "./pages/callback/Callback";
import Info from "./pages/info/Info";
import Apps from "./pages/apps/Apps";
import AppsRoutes from "./pages/apps/AppsRoutes";
import Faces from "./pages/faces/Faces";
import Files from "./pages/files/Files";
import Settings from "./pages/settings/Settings";
import SettingsRoutes from "./pages/settings/SettingsRoutes";
import KeyVault from "./pages/keyvault/KeyVault";
import Commands from "./pages/commands/Commands";

const router = createBrowserRouter([
    {
        path: "",
        element: <Authentication />,
    },
    {
        path: "",
        element: <Layout />,
        children: [
            { path: "info", element: <Info /> },
            { path: "apps", element: <Apps path={"apps"} />, children: AppsRoutes },
            { path: "faces", element: <Faces /> },
            { path: "files", element: <Files /> },
            { path: "settings", element: <Settings path={"settings"} />, children: SettingsRoutes },
            { path: "keyvault", element: <KeyVault /> },
            { path: "commands", element: <Commands /> },
            { path: "/callback/:id", element: <Callback /> },
        ]
    },
    {
        path: "*",
        element: <NoPage />
    }
]);

export default router;