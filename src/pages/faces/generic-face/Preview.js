import * as React from "react";
import { Box, Modal } from "@mui/material";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    p: 0,
    m: 0
};

function Preview({ url, onClose }) {
    return (
        <Modal PaperComponent={Box} open={true} onClose={onClose} maxWidth="lg" transitionDuration={0}>
            <Box sx={style}><img alt={url} src={url} onClick={onClose}></img></Box>
        </Modal>
    );
}

export default Preview;
