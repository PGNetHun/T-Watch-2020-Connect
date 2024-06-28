import * as React from "react";
import { Box, Button, Paper, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useExecuteCommandMutation } from "../../api/deviceApi";
import * as Command from "../../constants/commands";
import GetTime from "./panels/GetTime";
import SetTime from "./panels/SetTime";

function createCommand(id, label, componentCreator = null) {
  return {
    id: id,
    label: label,
    componentCreator: componentCreator
  }
}
function componentCreator(Component) {
  return function inner(setParameters, result) {
    return (<Component setParameters={setParameters} result={result} />);
  }
}

const commands = [
  createCommand(Command.Sleep, "Sleep"),
  createCommand(Command.Reset, "Reset"),
  createCommand(Command.GetTime, "Get time", componentCreator(GetTime)),
  createCommand(Command.SetTime, "Set time", componentCreator(SetTime)),
];

const commands_for_select = commands.map(x => ({
  id: x.id,
  label: x.label
}));


function Commands() {
  const [executeCommand] = useExecuteCommandMutation();
  const [command, setCommand] = React.useState(null);
  const [parameters, setParameters] = React.useState(null);
  const [result, setResult] = React.useState(null);

  function execute() {
    if (!command) {
      return;
    }
    executeCommand({ id: command.id, parameters: parameters })
      .unwrap()
      .then((result) => {
        setResult(result);
      });
  }

  function onCommandChange(event) {
    const id = event.target?.value;
    if (!id) {
      setCommand(null);
    }
    else {
      setCommand(commands.find(x => x.id == id));
    }
    setResult(null);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "row", gap: 2 }}>
        <FormControl sx={{ width: 300 }}>
          <InputLabel id="command-select-label">Commands</InputLabel>
          <Select
            label="Commands"
            id="command-select"
            labelId="command-select-label"
            value={command?.id || ""}
            onChange={onCommandChange}
          >
            {commands_for_select.map(({ id, label }, index) => (
              <MenuItem key={index} value={id}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" aria-label="execute" sx={{ minWidth: "10em" }} onClick={execute} disabled={!command}>Execute</Button>
      </Paper>
      {command && (
        <>
          {!!command.componentCreator && (
            <Paper sx={{ p: 2 }}>
              {command.componentCreator(setParameters, result)}
            </Paper>
          )}

          {!command.componentCreator && result && (
            <Paper sx={{ p: 2 }}>
              <Typography component="h3" variant="h5">Result:</Typography>
              <Typography component="pre">{JSON.stringify(result)}</Typography>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}

export default Commands;
