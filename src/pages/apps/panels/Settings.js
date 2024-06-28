import * as React from "react";
import { Box, Select, MenuItem, FormControl, InputLabel, Paper } from "@mui/material";
// import { useSelector } from "react-redux";
//import { useParams } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router';
import SpotifyPanel from "./settings/Spotify";

const Apps = [
  { name: "Spotify", route: "spotify", content: <SpotifyPanel /> }
]

function Settings() {
  //const installed = useSelector((state) => state.apps.installed);
  const params = useParams();
  const navigate = useNavigate();

  const [selected, setSelected] = React.useState(() => {
    return Apps.find(x => x.route === params?.name);
  });

  function select(name) {
    const app = Apps.find(x => x.name === name);
    setSelected(app);
    navigate(app.route, { relative: "path" });
  }

  return (
    <>
      <Paper sx={{ p: 1, mb: 2 }}>
        <Box sx={{ display: "flex", flexFlow: "row", gap: 2, justifyContent: "center" }}>
          <FormControl sx={{ minWidth: "20em" }} >
            <InputLabel id="app-selector-label">App</InputLabel>
            <Select
              label="App"
              labelId="app-selector-label"
              value={selected?.name || ""}
              onChange={(event) => select(event.target.value)}
            >
              {Apps.map(({ name }, index) => (
                <MenuItem key={index} value={name}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>
      {selected && selected.content}
    </>
  );
}

export default Settings;
