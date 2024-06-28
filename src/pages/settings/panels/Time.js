import * as React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { toast } from 'react-toastify';
import { useGetFileQuery, usePostFileMutation } from "../../../api/deviceApi";
import { MultiTextField, Component, createField } from "../../../shared/MultiTextField";
import { TimeConfig as TimeConfigFilePath } from "../../../constants/files";

const FETCH_IP_TIMEZONE_URL = "http://worldtimeapi.org/api/ip"
const Field = {
    Offset: "offset",
    Region: "region",
    TimeZone: "timezone",
    AutoUpdate: "auto_update"
}

function Time() {
    const { data, refetch, isLoading } = useGetFileQuery(TimeConfigFilePath);
    const [postFile, { isLoading: isSaving }] = usePostFileMutation();

    const [fields, setFields] = React.useState([
        createField(Field.Offset, "Offset", Component.Number(), 0),
        createField(Field.Region, "Region", Component.Text(), ""),
        createField(Field.TimeZone, "Timezone", Component.Text(), ""),
        createField(Field.AutoUpdate, "Auto update", Component.Switch(), false),
    ]);

    React.useEffect(() => {
        if (data) {
            const json = data.asJson();
            const copied = [...fields];
            const update = (name, value) => {
                const item = copied.find(x => x.name === name);
                item.value = value;
            }

            update(Field.Offset, json[Field.Offset]);
            update(Field.Region, json[Field.Region]);
            update(Field.TimeZone, json[Field.TimeZone]);
            update(Field.AutoUpdate, json[Field.AutoUpdate]);

            setFields(copied);
        }
    }, [data]);

    const save = async (event) => {
        event.preventDefault();

        const content = fields.reduce((result, item) => ({ ...result, [item.name]: item.value }), {});

        await postFile({ path: TimeConfigFilePath, content: JSON.stringify(content) })
            .unwrap()
            .then(() => {
                toast.success("Saved");
                refetch();
            });
    }

    const fillLocal = async () => {
        await fetch(FETCH_IP_TIMEZONE_URL)
            .then(async result => {
                if (result.status != 200) {
                    toast.error(`${result.status} - ${result.statusText}\n${FETCH_IP_TIMEZONE_URL}`);
                    return;
                }

                const json = await result.json();

                const copied = [...fields];
                const update = (name, value) => {
                    const item = copied.find(x => x.name === name);
                    item.value = value;
                }

                update(Field.Offset, json["raw_offset"]);
                update(Field.Region, json["abbreviation"]);
                update(Field.TimeZone, json["timezone"]);

                setFields(copied);
                toast.success("Success");
            })
            .catch(error => {
                toast.error(error.message);
            });
    }

    return (
        <>
            <Box
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={save}
                hidden={isLoading}
            >
                <MultiTextField fields={fields} setFields={setFields} elevation={1} sx={{ mb: 2 }}></MultiTextField>
                <Box sx={{ display: "flex", flexFlow: "row-reverse", gap: 2 }}>
                    <Button variant="contained" type="submit" aria-label="save" sx={{ minWidth: "10em" }} disabled={isSaving}>Save</Button>
                    <Button variant="contained" type="button" onClick={fillLocal} aria-label="fill with local timezone" disabled={isSaving}>Fill with local timezone</Button>
                </Box>
            </Box>
            {isLoading && <Box textAlign={"center"} mt={2}><CircularProgress /></Box>}
        </>
    );
}

export default Time;
