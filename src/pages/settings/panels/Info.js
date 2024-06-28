import * as React from "react";
import { Box, CircularProgress, Button } from "@mui/material";
import { toast } from 'react-toastify';
import { MultiTextField, Component, createField } from "../../../shared/MultiTextField";
import { useGetInfoQuery, useUpdateInfoMutation } from "../../../api/deviceApi";

const Field = {
    ID: "ID",
    Name: "Name",
    Type: "Type",
    Owner: "Owner"
}

function Info() {
    const { data, refetch, isLoading } = useGetInfoQuery();
    const [updateInfo, { isLoading: isSaving }] = useUpdateInfoMutation();
    const [fields, setFields] = React.useState([
        createField(Field.ID, Field.ID, Component.Text({ required: true })),
        createField(Field.Name, Field.Name, Component.Text({ required: true })),
        createField(Field.Type, Field.Type, Component.Text({ required: true })),
        createField(Field.Owner, Field.Owner, Component.Text()),
    ]);

    React.useEffect(() => {
        if (data) {
            setFields(fields => {
                const copied = [...fields];
                const update = (name, value) => {
                    const item = copied.find(x => x.name === name);
                    item.value = value;
                }

                update(Field.ID, data.id)
                update(Field.Name, data.name)
                update(Field.Type, data.type)
                update(Field.Owner, data.owner.name)

                return copied;
            });
        }
    }, [data]);

    const getFieldValue = (name) => {
        return fields.find(x => x.name === name)?.value;
    }

    const save = async (event) => {
        event.preventDefault();

        const info = {
            "id": getFieldValue(Field.ID),
            "name": getFieldValue(Field.Name),
            "type": getFieldValue(Field.Type),
            "owner": {
                "name": getFieldValue(Field.Owner)
            }
        }

        //updateInfo({ content: JSON.stringify(content) })
        updateInfo(info)
            .unwrap()
            .then(() => {
                toast.success("Saved");
                refetch();
            });
    }

    return (
        <>
            <Box
                component="form"
                autoComplete="off"
                onSubmit={save}
                hidden={isLoading}
            >
                <MultiTextField fields={fields} setFields={setFields} elevation={1} sx={{ mb: 2 }}></MultiTextField>
                <Button variant="contained" type="submit" aria-label="save" sx={{ minWidth: "10em", float: "right" }} hidden={fields.length == 0} disabled={isSaving}>Save</Button>
            </Box>
            {isLoading && <Box textAlign={"center"} mt={2}><CircularProgress /></Box>}
        </>
    );
}

export default Info;
