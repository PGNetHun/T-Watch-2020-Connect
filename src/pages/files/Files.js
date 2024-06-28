import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Divider, IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useGetEntriesQuery } from "../../api/deviceApi";
import PathBreadCrumb from "./PathBreadCrumb";
import FileContentView from "./FileContentView";
import Entry from "./Entry";

function Files() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [path, setPath] = React.useState(() => {
    return searchParams?.get("path") || "/";
  });
  const [entries, setEntries] = React.useState([]);
  const [filePathToView, showFileContent] = React.useState(null);

  const { data, refetch } = useGetEntriesQuery(path);

  const navigatePath = (path) => {
    showFileContent(null);
    setPath(path);
    setSearchParams({ path });
  }

  React.useEffect(() => {
    if (data) {
      let x = [...data];
      x.sort((a, b) => {
        return a.isdirectory === b.isdirectory
          ? a.name.localeCompare(b.name)
          : a.isdirectory ? -1 : 1;
      });
      setEntries(x);
    }
  }, [data]);

  return (
    <Box>
      <Box sx={{ mb: "1em", position: "relative" }}>
        <PathBreadCrumb path={path} navigatePath={navigatePath}></PathBreadCrumb>
        <Tooltip title="Refresh">
          <IconButton sx={{ position: "absolute", top: "0", right: "0" }} onClick={() => refetch()}><RefreshIcon></RefreshIcon></IconButton>
        </Tooltip>
      </Box>
      <Divider />
      <Box sx={{ mt: "1em", display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", gap: "1em" }}>
        {entries.map(({ name, isdirectory }, index) =>
          <Entry
            key={index}
            name={name}
            isdirectory={isdirectory}
            path={path}
            navigatePath={navigatePath}
            showFileContent={showFileContent}>
          </Entry>)
        }
      </Box>
      {filePathToView && <FileContentView path={filePathToView} onClose={() => showFileContent(null)}></FileContentView>}
    </Box>
  );
}

export default Files;
