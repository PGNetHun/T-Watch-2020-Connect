// TODO:
// - add tabs: "Backup/Restore": backup/restore "/config" folder and KeyVault (use background job (webworker API))

import * as React from "react";
import InfoIcon from "@mui/icons-material/Info";
import WifiIcon from "@mui/icons-material/Wifi";
import TimeIcon from "@mui/icons-material/Schedule";
import SaveIcon from "@mui/icons-material/Save";
import TabsContext from "../../shared/TabsContext";

const tabs = [
  { name: "Info", route: "info", icon: <InfoIcon /> },
  { name: "Wifi", route: "wifi", icon: <WifiIcon /> },
  { name: "Time", route: "time", icon: <TimeIcon /> },
  { name: "Backup", route: "backup", icon: <SaveIcon /> }
]

function Settings({path}) {
  return (
    <TabsContext
      parentPath={path}
      orientation="vertical"
      tabs={tabs}
      tabsProps={{ sx: { borderRight: 1, borderColor: 'divider', minWidth: "10em" } }}
    ></TabsContext>
  );
}

export default Settings;
