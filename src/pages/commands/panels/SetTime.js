import * as React from "react";
import { Box, IconButton, Link, TextField, Tooltip, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const getCurrentUnixTime = () => Math.floor(Date.now() / 1000);

function SetTime({ setParameters, result }) {
    const [unixtime, setUnixtime] = React.useState(getCurrentUnixTime());

    React.useEffect(() => {
        setParameters(unixtime);
    }, [unixtime]);

    let time = null;
    try {
        time = new Date(unixtime * 1000);
    }
    finally {
        //
    }

    return (
        <Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <TextField label="Unix timestamp (seconds)" type="number" value={unixtime} onChange={event => setUnixtime(event.target.value)} />
                <Tooltip title="Reset to current unix time">
                    <IconButton onClick={() => setUnixtime(getCurrentUnixTime())} sx={{ p: 2 }}><RefreshIcon></RefreshIcon></IconButton>
                </Tooltip>
            </Box>

            {time && (
                <Box sx={{ mt: 2 }}>
                    <Typography>As unix time: {time.toUTCString()}</Typography>
                    <Typography>As local time: {time.toLocaleString()}</Typography>
                    <Typography>Full time format: {time.toString()}</Typography>
                    <Typography>ISO format: {time.toISOString()}</Typography>
                </Box>
            )}

            <Typography sx={{ mt: 2 }}>Advanced converter: <Link target="_blank" href="https://www.epochconverter.com/">https://www.epochconverter.com/</Link></Typography>

            {result && (
                <Box sx={{ mt: 3 }}>
                    <Typography component="h4">Result</Typography>
                    <Typography>{result}</Typography>
                </Box>
            )}
        </Box>
    );
}

export default SetTime;
