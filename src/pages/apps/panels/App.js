//TODO: when deleting app, then delete config and temporary files, too

import * as React from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent, CardMedia, Typography, CardActions, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteEntryMutation } from "../../../api/deviceApi";
import { removeInstalled } from "../../../redux/appsSlice";

const _TEST_IMAGE_URL = "https://raw.githubusercontent.com/PGNetHun/T-Watch-2020-Store/main/faces/generic-face/_previews/abstract-01_preview.jpg";

const ImageWidth = "120px";
const ImageHeight = "120px";

function App({ name }) {
    const dispatch = useDispatch();
    const [deleteEntry] = useDeleteEntryMutation();

    async function deleteApp() {
        if (window.confirm(`Delete app?\r\n"${name}"`)) {
            await deleteEntry(name)
                .then(() => {
                    dispatch(removeInstalled(name));
                });
        }
    }

    return (
        <Card sx={{ flexBasis: `${ImageWidth}`, flexGrow: 0 }} >
            <CardMedia image={_TEST_IMAGE_URL} sx={{ width: ImageWidth, height: ImageHeight }}></CardMedia>
            <CardContent sx={{ pt: 1, pb: 0, pl: 1, pr: 1 }}>
                <Typography variant="body2">{name}</Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "right", p: 0 }}>
                <IconButton size="small" sx={{ textAlign: "right" }} onClick={() => deleteApp()}><DeleteIcon></DeleteIcon></IconButton>
            </CardActions>
        </Card>
    );
}

export default App;