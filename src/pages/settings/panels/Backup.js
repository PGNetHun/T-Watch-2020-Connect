import * as React from "react";
import { Box } from "@mui/material";
import TabsContext from "../../../shared/TabsContext";

function BackupPanel() {
    return (
        <Box>TODO - Backup</Box>
    );
}

function RestorePanel() {
    return (
        <Box>TODO - Restore</Box>
    );
}

const tabs = [
    { name: "Backup", content: <BackupPanel /> },
    { name: "Restore", content: <RestorePanel /> }
]

function Backup() {
    return (
        <TabsContext
            tabs={tabs}
            tabsProps={{ sx: { borderBottom: 1, borderColor: 'divider', width: "100%" }, centered: "true" }}
            tabProps={{ sx: { minWidth: "30%" } }}
        ></TabsContext>
    );
}

export default Backup;
