import * as React from "react";
import {
    Box, Button, CircularProgress, InputAdornment, IconButton, InputLabel,
    FormControl, Paper, OutlinedInput, TextField, Tooltip, Typography,
    TableContainer, Table, TableRow, TableBody, TableHead, TableCell
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { toast } from 'react-toastify';
import { useGetKeyVaultItemQuery, usePostKeyVaultItemMutation } from "../../../api/deviceApi";
import { Wifi as KeyVaultWifi } from "../../../constants/keyVault"

function createNetworkObject(ssid = "", password = "", showPassword = false) {
    return {
        ssid: ssid,
        password: password,
        showPassword: showPassword
    }
}

function Wifi() {
    const { data, refetch, isLoading: isLoading } = useGetKeyVaultItemQuery(KeyVaultWifi);
    const [postKeyVaultItem, { isLoading: isSaving }] = usePostKeyVaultItemMutation();
    const [accessPoint, setAccessPoint] = React.useState(() => createNetworkObject());
    const [networks, setNetworks] = React.useState([]);

    React.useEffect(() => {
        if (data) {
            try {
                const stored = JSON.parse(data.value);
                const ap = stored["access_point"];
                setAccessPoint(createNetworkObject(ap?.ssid, ap?.password));
                setNetworks(stored.networks.map(x => createNetworkObject(x.ssid, x.password)) || []);
            }
            catch (e) {
                toast.error(`Invalid configuration!\r\n${e.message}`);
            }
        }
    }, [data]);

    const updateAccessPoint = (ssid, password, showPassword) => {
        setAccessPoint(prev => ({ ...prev, ssid, password, showPassword }));
    }

    const addNetwork = () => {
        setNetworks(prev => [...prev, createNetworkObject("", "", true)]);
    }

    const updateNetwork = (index, ssid, password) => {
        if (index < 0 || index >= networks.length) {
            return;
        }

        setNetworks(prev => {
            const network = prev[index];
            network.ssid = ssid;
            network.password = password;
            return [...prev];
        });
    }

    const deleteNetwork = (index) => {
        setNetworks(prev => prev.filter((_, i) => i !== index));
    }

    const setShowPassword = (index, showPassword) => {
        setNetworks(prev => {
            const network = prev[index];
            network.showPassword = showPassword;
            return [...prev];
        });
    }

    const save = async (event) => {
        event.preventDefault();
        setNetworks(items => items.filter(x => !!x.ssid));
        const storeNetworks = networks
            .filter(x => !!x.ssid)
            .map(x => ({
                ssid: x.ssid,
                password: x.password
            }));

        const value = {
            "access_point": {
                "ssid": accessPoint.ssid,
                "password": accessPoint.password
            },
            "networks": storeNetworks
        }

        await postKeyVaultItem({ key: KeyVaultWifi, value: JSON.stringify(value) })
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
                noValidate
                autoComplete="off"
                onSubmit={save}
                hidden={isLoading}
            >
                <Paper sx={{ mb: 2, p: 2 }}>
                    <Typography sx={{ mb: 1 }}>Access Point:</Typography>
                    <Box sx={{ display: "flex", flexFlow: "row", gap: 2 }}>
                        <TextField
                            label="AP name"
                            value={accessPoint.ssid}
                            fullWidth
                            onChange={event => updateAccessPoint(event.target.value, accessPoint.password, accessPoint.showPassword)}
                            disabled={isSaving}
                        />
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel htmlFor="accesspoint-password">Password</InputLabel>
                            <OutlinedInput
                                id="accesspoint-password"
                                label="Password"
                                value={accessPoint.password}
                                type={accessPoint.showPassword ? 'text' : 'password'}
                                onChange={event => updateAccessPoint(accessPoint.ssid, event.target.value, accessPoint.showPassword)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => updateAccessPoint(accessPoint.ssid, accessPoint.password, !accessPoint.showPassword)}
                                            onMouseDown={(event) => event.preventDefault()}
                                            edge="end"
                                        >
                                            {accessPoint.showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </Box>
                </Paper>
                <TableContainer component={Paper} elevation={1} sx={{ mb: 2 }}>
                    <Typography sx={{ p: 2 }}>Wifi networks:</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name (SSID)</TableCell>
                                <TableCell>Password</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Refresh list"><IconButton onClick={() => refetch()}><RefreshIcon /></IconButton></Tooltip>
                                    <Tooltip title="Add new Wifi network"><IconButton onClick={() => addNetwork()}><AddIcon></AddIcon></IconButton></Tooltip>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {networks?.map(({ ssid, password, showPassword }, index) => (
                                <TableRow key={index}>
                                    <TableCell align="right">
                                        <TextField
                                            label="Name"
                                            value={ssid}
                                            fullWidth
                                            onChange={event => updateNetwork(index, event.target.value, password)}
                                            disabled={isSaving}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormControl variant="outlined" fullWidth>
                                            <InputLabel htmlFor={`wifi-network-password-${index}`}>Password</InputLabel>
                                            <OutlinedInput
                                                id={`wifi-network-password-${index}`}
                                                label="Password"
                                                value={password}
                                                type={showPassword ? 'text' : 'password'}
                                                onChange={event => updateNetwork(index, ssid, event.target.value)}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(index, !showPassword)}
                                                            onMouseDown={(event) => event.preventDefault()}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Delete item"><IconButton onClick={() => deleteNetwork(index)}><DeleteIcon /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {networks.length == 0 && (
                        <Typography sx={{ p: 2, textAlign: "center" }}>No network configured yet</Typography>
                    )}
                </TableContainer>
                <Button variant="contained" type="submit" aria-label="save" sx={{ minWidth: "10em", float: "right" }} hidden={networks.length == 0} disabled={isSaving}>Save</Button>
            </Box>
            {isLoading && <Box textAlign={"center"} mt={2}><CircularProgress /></Box>}
        </>
    );
}

export default Wifi;
