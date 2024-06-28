import * as React from "react";
import { Card, CardContent, CardActionArea, CardMedia, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

function Entry({ name, isdirectory, path, navigatePath, showFileContent }) {

    const openEntry = (path) => {
        if (isdirectory) {
            navigatePath(path);
        }
        else {
            showFileContent(path);
        }
    }

    return (
        <Card sx={{ minWidth: 100 }} >
            <CardActionArea sx={{ p: "1em" }} onClick={() => openEntry(`${path}/${name}`.replace("//", "/"))}>
                <CardMedia sx={{ textAlign: "center" }}>
                    {isdirectory && <FolderIcon></FolderIcon>}
                    {!isdirectory && <InsertDriveFileIcon></InsertDriveFileIcon>}
                </CardMedia>
                <CardContent sx={{ p: "0", textAlign: "center" }}>
                    <Typography variant="body2">{name}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default Entry;
