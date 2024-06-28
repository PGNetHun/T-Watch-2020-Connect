import * as React from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, DialogActions, Typography } from "@mui/material";
import { useLazyGetFileQuery, usePostFileMutation } from "../../api/deviceApi";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

const ImageExtensions = ["jpg", "jpeg", "png"];
const TextFileExtensions = ["txt", "py", "config", "json", "ini", "c", "h", "md"];
const ImageTypes = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png"
}

function FileContentView({ path, onClose }) {
    const [trigger] = useLazyGetFileQuery();
    const [postFile] = usePostFileMutation();

    const extension = path?.split(".").pop() || "";
    const isImage = ImageExtensions.includes(extension) || false;
    const isTextFile = TextFileExtensions.includes(extension) || false;

    const [open, setOpen] = React.useState(false);
    const [content, setContent] = React.useState(null);
    const [size, setSize] = React.useState(0);

    React.useEffect(() => {
        if (isTextFile || isImage) {
            trigger(path)
                .unwrap()
                .then(data => {
                    if (!data) {
                        return;
                    }
                    if (isTextFile) {
                        setSize(data.size);
                        setContent(data.asText());
                        setOpen(true);
                    }
                    if (isImage) {
                        const type = ImageTypes[extension] || "image/jpeg";
                        setSize(data.size);
                        setContent(`data:${type};base64,${data.asBase64()}`);
                        setOpen(true);
                    }
                });
        }
    }, [path]);

    const closeView = () => {
        setOpen(false);
        onClose();
    };

    const save = async () => {

        await postFile({ path: path, content: content })
            .unwrap()
            .then(() => {
                closeView();
            });
    }

    return (
        <Dialog open={open} onClose={closeView} scroll="paper" maxWidth="lg">
            <DialogTitle>{path}</DialogTitle>
            <DialogContent dividers sx={{ minHeight: "10em" }}>
                {isImage && content &&
                    <Box sx={{ textAlign: "center" }}>
                        <img alt={path} src={content}></img>
                    </Box>
                }
                {isTextFile && content &&
                    <Box width="50vw">
                        <Editor
                            value={content}
                            onValueChange={text => setContent(text)}
                            highlight={text => highlight(text, languages.js)}
                            padding={10}
                            style={{
                                fontFamily: '"Fira code", "Fira Mono", monospace',
                                fontSize: 12,
                            }}
                        />
                    </Box>
                }
            </DialogContent>
            <DialogActions>
                <Typography sx={{ flex: "auto" }}>{size} Bytes</Typography>
                {isTextFile && <Button variant="contained" sx={{ minWidth: "10em" }} onClick={save}>Save</Button>}
                <Button variant="contained" sx={{ minWidth: "10em" }} onClick={closeView}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default FileContentView;
