// TODO: 
// - finish
// - add horizontal tabs on top: "Installed", "Available", "Launcher", "Configuration"
// - "Installed" tab: show thumbnails of installed apps in card, allow delete app (card action button)
// - "Available" tab: show thumbnails of available apps in card, allow quick install (card action button)
// - "Launcher" tab: add grid with app icons, use sortable drag-and-drop library: 
//    http://clauderic.github.io/react-sortable-hoc/#/basic-configuration/grid?_k=vtvd5k
// - "Configure": show tabs on left with installed apps, in right panel show app's configuration panel (dynamic component like the panels used in Commands page)
// - Get thumbnails and apps from T-Watch-2020-Store repo (repo should contain gzipped MPY apps)

import * as React from "react";
import { useDispatch } from "react-redux";
import AppsIcon from "@mui/icons-material/Apps";
import GridViewIcon from "@mui/icons-material/GridView";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import { useGetDirectoriesQuery } from "../../api/deviceApi";
import { setInstalled } from "../../redux/appsSlice";
import { AppsPath } from "../../constants/files";
import TabsContext from "../../shared/TabsContext";

const tabs = [
  { name: "Installed", route: "installed", icon: <AppsIcon /> },
  { name: "Settings", route: "settings", icon: <SettingsApplicationsIcon /> },
  { name: "Launcher", route: "launcher", icon: <GridViewIcon /> }
]

function Apps({ path }) {
  const dispatch = useDispatch();

  const { data: installedApps } = useGetDirectoriesQuery(AppsPath);

  React.useEffect(() => {
    if (installedApps) {
      dispatch(setInstalled(installedApps));
    }
  }, [installedApps]);

  return (
    <TabsContext
      parentPath={path}
      tabs={tabs}
      tabsProps={{ sx: { borderBottom: 1, borderColor: 'divider', width: "100%", }, centered: true }}
      tabProps={{ sx: { minWidth: "15%" } }}
    ></TabsContext>
  );
}

export default Apps;
