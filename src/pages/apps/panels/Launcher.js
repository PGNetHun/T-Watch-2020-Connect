import * as React from "react";
import { Box, Button, Select, MenuItem, FormControl, InputLabel, Paper } from "@mui/material";
import { usePostFileMutation } from "../../../api/deviceApi";
import { LauncherConfig } from "../../../constants/files";
import DefaultLauncherPanel from "./launchers/DefaultLauncher";

const LauncherPanels = [
  { name: "default", content: <DefaultLauncherPanel /> }
]

function Launcher() {
  const [selected, setSelected] = React.useState(null);
  const [postFile, { isLoading: isSaving }] = usePostFileMutation();

  const save = async () => {
    if (!selected?.name) {
      return;
    }

    const config = {
      "launcher": selected.name
    }
    postFile({ path: LauncherConfig, content: JSON.stringify(config), overwrite: true });
  }

  function select(name) {
    setSelected(LauncherPanels.find(x => x.name === name));
  }

  return (
    <>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", flexFlow: "row", gap: 2, justifyContent: "center" }}>
          <FormControl sx={{ minWidth: "20em" }} >
            <InputLabel id="launcher-selector-label">Launcher</InputLabel>
            <Select
              label="Launcher"
              labelId="launcher-selector-label"
              value={selected?.name || ""}
              onChange={(event) => select(event.target.value)}
            >
              {LauncherPanels.map(({ name }, index) => (
                <MenuItem key={index} value={name}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" aria-label="save" sx={{ minWidth: "10em" }} onClick={save} disabled={isSaving}>Save</Button>
        </Box>
      </Paper>
      {selected && selected.content}
    </>
  );
}

export default Launcher;
