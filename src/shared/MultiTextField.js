import * as React from "react";
import {
    Paper, TextField, Switch,
    TableContainer, Table, TableRow, TableBody, TableCell, Autocomplete
} from "@mui/material";

const Component = {
    Text: textFieldCreator,
    Number: numberFieldCreator,
    AutoComplete: autoCompleteFieldCreator,
    Switch: switchCreator
}

function createField(name, label, component, value = null) {
    return { component, label, name, value }
}

function textFieldCreator(props) {
    return function inner(index, label, value, updateField) {
        return (
            <TextField label={label} value={value || ""} onChange={event => updateField(index, event.target.value)} fullWidth  {...props} />
        );
    }
}

function numberFieldCreator(props) {
    return function inner(index, label, value, updateField) {
        return (
            <TextField label={label} value={value || 0} type="number" onChange={event => updateField(index, Number(event.target.value))} fullWidth {...props} />
        );
    }
}

function autoCompleteFieldCreator(props) {
    return function inner(index, label, value, updateField) {
        return (
            <Autocomplete label={label} value={value || ""} type="number" onChange={(event, newValue) => updateField(index, newValue?.id)} fullWidth {...props} />
        );
    }
}


function switchCreator(props) {
    return function inner(index, _label, value, updateField) {
        return (
            <Switch checked={value || false} onChange={event => updateField(index, event.target.checked)} {...props} />
        );
    }
}

function MultiTextField({ fields, setFields, ...props }) {

    function updateField(index, value) {
        const copied = [...fields];
        const field = copied[index];
        field.value = value;
        setFields(copied);
    }

    return (
        <TableContainer component={Paper} {...props}>
            <Table>
                <TableBody>
                    {fields.map(({ label, value, component }, index) =>
                        <TableRow key={index}>
                            <TableCell align="right">{label}</TableCell>
                            <TableCell>
                                {component(index, label, value, updateField)}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export { MultiTextField, Component, createField };
