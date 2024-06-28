import * as React from "react";
import { Box, Typography, Link } from "@mui/material";

function GetTime({ result }) {
    const time = result ? new Date(result * 1000) : null;
    return result
        ? (
            <Box>
                <Typography>Unix timestamp: <Link target="_blank" href={`https://www.epochconverter.com/?q=${result}`}>{result}</Link></Typography>
                <br />
                <Typography>As unix time: {time.toUTCString()}</Typography>
                <Typography>As local time: {time.toLocaleString()}</Typography>
                <Typography>Full time format: {time.toString()}</Typography>
                <Typography>ISO format: {time.toISOString()}</Typography>
            </Box>
        )
        : (
            <Typography>Execute command to get device time</Typography>
        )
}

export default GetTime;
