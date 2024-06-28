//TODO: 
// - add dropdown to top center to select face, ad below it the face specific configuration panel (if available)
// - get configured face from device, and set in dropdown
// - get faces from T-Watch-2020-Store repo

import * as React from "react";
import { Box, Button, Select, MenuItem, FormControl, InputLabel, Paper } from "@mui/material";
import { usePostFileMutation } from "../../api/deviceApi";
import { FaceConfig } from "../../constants/files";
import GenericFacePanel from "./generic-face/Panel";

const FacePanels = [
  { name: "generic-face", content: <GenericFacePanel /> }
]

function Faces() {
  const [selected, setSelected] = React.useState(null);
  const [postFile, { isLoading: isSaving }] = usePostFileMutation();

  const save = async () => {
    if (!selected?.name) {
      return;
    }

    const config = {
      "face": selected.name
    }
    postFile({ path: FaceConfig, content: JSON.stringify(config), overwrite: true });
  }

  function select(name) {
    setSelected(FacePanels.find(x => x.name === name));
  }

  return (
    <>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", flexFlow: "row", gap: 2, justifyContent: "center" }}>
          <FormControl sx={{ minWidth: "20em" }} >
            <InputLabel id="face-selector-label">Face</InputLabel>
            <Select
              label="Face"
              labelId="face-selector-label"
              value={selected?.name || ""}
              onChange={(event) => select(event.target.value)}
            >
              {FacePanels.map(({ name }, index) => (
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

export default Faces;
