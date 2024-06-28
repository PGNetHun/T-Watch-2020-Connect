import * as React from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import App from "./App";

function Installed() {
  const installed = useSelector((state) => state.apps.installed);

  return (
    <Box sx={{ mt: "1em", display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", gap: "1em" }}>
      {installed?.map((name, index) =>
        <App
          key={index}
          name={name}
        />)
      }
    </Box>
  );
}

export default Installed;
