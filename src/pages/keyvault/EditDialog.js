import * as React from "react";
import { Autocomplete, Box, Button, Dialog, DialogContent, DialogTitle, DialogActions, TextField } from "@mui/material";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { useLazyGetKeyVaultItemQuery, usePostKeyVaultItemMutation } from "../../api/deviceApi";
import * as KeyVaultKeys from "../../constants/keyVault";

const predefinedKeys = Object.values(KeyVaultKeys || {});
predefinedKeys.sort();

function EditDialog({ itemKey, isItemNew, onClose }) {

    const [trigger] = useLazyGetKeyVaultItemQuery({ refetchOnFocus: false, refetchOnReconnect: false });
    const [postKeyVaultItem] = usePostKeyVaultItemMutation();
    const [open, setOpen] = React.useState(false);
    const [key, setKey] = React.useState(null);
    const [value, setValue] = React.useState("");

    React.useEffect(() => {
        if (isItemNew) {
            setKey("");
            setValue("");
            setOpen(true);
        }
        else {
            if (itemKey) {
                setKey(itemKey);
                trigger(itemKey)
                    .unwrap()
                    .then(data => {
                        setValue(data.value);
                        setOpen(true);
                    });
            }
        }
    }, [itemKey]);

    const closeDialog = () => {
        setValue("");
        setOpen(false);
        onClose(false, null);
    }

    const save = () => {
        postKeyVaultItem({ key, value })
            .unwrap()
            .then(() => {
                setValue("");
                setOpen(false);
                onClose(true, key);
            });
    }

    return (
        <Dialog open={open} onClose={closeDialog} scroll="paper" maxWidth="lg" >
            <DialogTitle>Edit KeyVault item</DialogTitle>
            <DialogContent dividers sx={{ minHeight: "10em" }}>
                {isItemNew &&
                    <Autocomplete
                        disablePortal
                        fullWidth
                        value={key}
                        options={predefinedKeys}
                        onChange={(_event, newValue) => setKey(newValue)}
                        onInputChange={(_event, newValue) => setKey(newValue)}
                        renderInput={(params) => (<TextField {...params} label="Key" />)}
                    />
                }
                {!isItemNew && (
                    <TextField
                        label="Key"
                        value={key}
                        disabled
                        fullWidth
                        variant="outlined"
                        onChange={(event) => setKey(event.target.value)}
                    />
                )}

                <Box sx={{ width: "50vw", mt: 2 }}>
                    <Editor
                        label="Value"
                        value={value}
                        highlight={text => highlight(text, languages.js)}
                        padding={10}
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 12,
                            border: "1px solid black",
                            minHeight: "30vh"
                        }}
                        onValueChange={setValue}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" aria-label="save" sx={{ minWidth: "10em" }} onClick={save}>Save</Button>
                <Button variant="contained" aria-label="close" sx={{ minWidth: "10em" }} onClick={closeDialog}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditDialog;
