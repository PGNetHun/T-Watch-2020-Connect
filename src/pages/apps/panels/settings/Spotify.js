// Create the callback page ( http://localhost:3000/callback/{spotify} ), 
// which stores received authentication data (query parameters) in local storage,
// and then redirects automatically to the correct step to continue

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Box, Button, Link, List, ListItem, ListItemText, Paper, TextField, Typography, Table, TableRow, TableBody, TableCell } from "@mui/material";
import CopyIcon from "@mui/icons-material/ContentCopyOutlined";
import { usePostKeyVaultItemMutation } from "../../../../api/deviceApi";
import { Spotify as KeyVaultKey } from "../../../../constants/keyVault";
import { remove as removeCallbackData } from "../../../../redux/callbackSlice";
import { set as setTempState } from "../../../../redux/tempStateSlice";
import { generateId } from "../../../../shared/Random";
import { generatePKCE } from "../../../../shared/Pkce";

const TempStateID = "spotify";
const CallbackID = "spotify";
const Scopes = "user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative";
const DefaultState = {
    redirectUri: "",
    clientID: "",
    authorizationCode: "",
    accessToken: "",
    refreshToken: "",
    expirationUnixtime: 0,
    requestCode: "",
    codeVerifier: "",
    codeChallenge: ""
};

function CopyField({ label = "", value }) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(value);
    }

    return (
        <Box fullwidth="true" sx={{ display: "flex", alignItems: "flex-center" }}>
            <TextField variant="filled" label={label} value={value} fullWidth InputProps={{ readOnly: true }}></TextField>
            <Button onClick={copyToClipboard} title="Copy to clipboard">
                <CopyIcon sx={{ color: "action.active", ml: 1 }} />
            </Button>
        </Box>
    )
}

function Spotify() {
    const dispatch = useDispatch();
    const tempState = useSelector((state) => state.tempState);
    const callback = useSelector((state) => state.callback);
    const isCallbackChecked = React.useRef(false);
    const [postKeyVaultItem, { isLoading: isSaving }] = usePostKeyVaultItemMutation();
    const [state, setState] = React.useState(() => {
        const tempStateData = tempState && (TempStateID in tempState) ? tempState[TempStateID] : null;
        if (tempStateData) {
            return { ...DefaultState, ...tempStateData };
        }

        return DefaultState;
    });

    const updateState = (params) => {
        setState(prev => ({ ...prev, ...params }));
    }

    const saveTempData = () => {
        dispatch(setTempState({ id: TempStateID, data: state }));
    }

    const authorize = async () => {
        if (!state?.clientID) {
            toast.warning("Client ID field is empty!")
            return;
        }

        saveTempData();

        const params = new URLSearchParams();
        params.append("client_id", state.clientID);
        params.append("response_type", "code");
        params.append("redirect_uri", state.redirectUri);
        params.append("state", state.requestCode);
        params.append("scope", Scopes);
        params.append("code_challenge_method", "S256");
        params.append("code_challenge", state.codeChallenge);
        const url = `https://accounts.spotify.com/authorize?${params.toString()}`;
        window.open(url, "_self", "noopener,noreferrer");
    }

    const getTokens = (authorizationCode) => {
        const payload = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: state.clientID,
                grant_type: "authorization_code",
                code: authorizationCode,
                redirect_uri: state.redirectUri,
                code_verifier: state.codeVerifier,
            })
        }

        const now = Math.floor(Date.now() / 1000);
        const url = "https://accounts.spotify.com/api/token";
        fetch(url, payload)
            .then(response => response.json())
            .then(json => {
                updateState({
                    accessToken: json["access_token"],
                    refreshToken: json["refresh_token"],
                    expirationUnixtime: now + json["expires_in"]
                });
            })
            .catch(error => {
                toast.error(`Failed to get tokens! Error: ${error || "unknown"}`);
            });
    }

    const save = async () => {
        if (!state) {
            return;
        }

        saveTempData();

        const keyvaultConfig = {
            "clientId": state.clientID,
            "code": state.authorizationCode,
            "accessToken": state.accessToken,
            "refreshToken": state.refreshToken,
            "expirationUnixtime": state.expirationUnixtime
        }

        postKeyVaultItem({ key: KeyVaultKey, value: JSON.stringify(keyvaultConfig) })
            .unwrap()
            .then(() => {
                toast.success("Saved");
            })
            .catch(() => {
                toast.error("Failed");
            });
    }

    React.useEffect(() => {
        if (!state?.redirectUri || !state?.requestCode) {
            updateState({
                redirectUri: `${window.location.origin}/callback/${CallbackID}`,
                requestCode: generateId()
            });
        }

        if (!state?.codeVerifier || !state?.codeChallenge) {
            generatePKCE()
                .then(({ codeVerifier, codeChallenge }) => {
                    updateState({
                        codeVerifier: codeVerifier,
                        codeChallenge: codeChallenge
                    });
                });
        }
    }, []);

    React.useEffect(() => {
        if (!isCallbackChecked.current) {
            isCallbackChecked.current = true
        }
        else {
            return;
        }

        const params = CallbackID in callback ? callback[CallbackID] : null;
        if (!params) {
            return;
        }

        dispatch(removeCallbackData(CallbackID));

        if (state.requestCode && ("requestCode" in params) && params["requestCode"] != state.requestCode) {
            toast.warning("Invalid 'state' parameter!");
            return;
        }

        if ("error" in params) {
            let message = "";
            const error = params["error"];
            if (error == "access_denied") {
                message = "Grant access to app."
            }
            else {
                message = `Error: ${error}`;
            }
            toast.warning(<div>Authorization failed!<br />{message}</div>);
            return;
        }

        if ("code" in params) {
            const code = params["code"];
            updateState({ authorizationCode: code });

            getTokens(code);
        }
    }, []);

    return (
        <Paper sx={{ p: 2, mb: 2 }}>

            <Typography variant="h4" align="center" sx={{ mb: 4 }}>Configure Spotify app</Typography>

            <Box sx={{ mb: 3 }}>
                <Typography variant="body1">To use Spotify app on your device, you have to register it in Spotify developer dashboard,
                    authorize access to your account, and then save all the information to device.
                    It will be stored in the <Link target="_blank" href="/keyvault">KeyVault</Link> of your device,
                    under the key <b>&apos;{KeyVaultKey}&apos;</b>.</Typography>
                <Typography variant="body1">The following steps describe the app creation process using <Link target="_blank" href="https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow">&apos;Authorization Code with PKCE Flow&apos;</Link>.</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
                <Typography variant="h5">Prerequisites</Typography>
                <List sx={{ listStyle: "disc", pl: 4 }}>
                    <ListItem sx={{ display: "list-item" }}>
                        <ListItemText>registered Spotify account</ListItemText>
                    </ListItem>
                </List>
            </Box>

            <Box sx={{ mb: 2 }}>
                <Typography variant="h5">Steps</Typography>

                <List sx={{ listStyle: "decimal", pl: 4 }}>
                    <ListItem sx={{ display: "list-item", mb: 2 }}>
                        <ListItemText>
                            <Typography variant="body1">Create app</Typography>
                            <Typography variant="body1">In order to control your Spotify player, create an App in <Link target="_blank" href="https://developer.spotify.com/dashboard">Spotify developer dashboard</Link> using the values below.</Typography>
                            <Typography variant="body1">Tutorial: <Link target="_blank" href="https://developer.spotify.com/documentation/web-api/tutorials/getting-started">https://developer.spotify.com/documentation/web-api/tutorials/getting-started</Link></Typography>

                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="right">App name</TableCell>
                                        <TableCell>
                                            <CopyField label={"Example"} value={"T-Watch-2020 Spotify"}></CopyField>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="right">App description</TableCell>
                                        <TableCell>
                                            <CopyField label={"Example"} value={"Spotify app for T-Watch-2020 smartwatch"}></CopyField>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="right">Redirect URI</TableCell>
                                        <TableCell>
                                            <CopyField value={"http://localhost:3000/callback/spotify"}></CopyField>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="right">APIs used</TableCell>
                                        <TableCell>
                                            <CopyField value={"Web API"}></CopyField>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </ListItemText>
                    </ListItem>

                    <ListItem sx={{ display: "list-item", mb: 2 }}>
                        <ListItemText>
                            <Typography variant="body1">Get Client ID</Typography>
                            <Typography variant="body1">Open <b>Settings</b> page of created app, and copy Client ID value to this text field:</Typography>
                            <TextField variant="outlined" label="Client ID" value={state.clientID} sx={{ mt: 2 }} fullWidth onChange={event => updateState({ clientID: event.target.value })} />
                        </ListItemText>
                    </ListItem>

                    <ListItem sx={{ display: "list-item", mb: 2 }}>
                        <ListItemText>
                            <Typography variant="body1">User authorization</Typography>
                            <Typography variant="body1">Authorize app to access your account using following <Link target="_blank" href="https://developer.spotify.com/documentation/web-api/concepts/scopes">scopes</Link>:</Typography>
                            <Box sx={{ mt: 1, mb: 1 }}>
                                <CopyField value={Scopes}></CopyField>
                            </Box>
                            <Box sx={{ mt: 2, textAlign: "center" }}>
                                <Button variant="contained" target="_blank" aria-label="authorize" sx={{ minWidth: "15em" }} onClick={authorize}>Authorize</Button>
                            </Box>
                            <Typography sx={{ mt: 2 }} variant="body1">The button opens Spotify authorization page, where you should click
                                on <b>&apos;Agree&apos;</b> button, and then it will redirect back to this page, so you can continue with the next step.</Typography>
                            <Typography sx={{ mt: 1 }} variant="body2">(You can remove the access at any time at <Link target="_blank" href="https://www.spotify.com/account/apps">https://www.spotify.com/account/apps</Link>)</Typography>
                        </ListItemText>
                    </ListItem>

                    <ListItem sx={{ display: "list-item", mb: 2 }}>
                        <ListItemText>
                            <Typography variant="body1">Save tokens and authorization information to device</Typography>

                            <Table>
                                <TableBody>

                                    <TableRow>
                                        <TableCell align="right">Client ID</TableCell>
                                        <TableCell>
                                            <CopyField value={state?.clientID}></CopyField>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell align="right">Authorization code</TableCell>
                                        <TableCell>
                                            <CopyField value={state?.authorizationCode}></CopyField>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell align="right">Access token</TableCell>
                                        <TableCell>
                                            <CopyField value={state?.accessToken}></CopyField>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell align="right">Refresh token</TableCell>
                                        <TableCell>
                                            <CopyField value={state?.refreshToken}></CopyField>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell align="right">Expiration time (unix time)</TableCell>
                                        <TableCell>
                                            <CopyField value={state?.expirationUnixtime}></CopyField>
                                        </TableCell>
                                    </TableRow>

                                </TableBody>
                            </Table>
                            <Box sx={{ mt: 2, textAlign: "center" }}>
                                <Button variant="contained" aria-label="save" sx={{ minWidth: "15em" }} onClick={save} disabled={isSaving}>Save</Button>
                            </Box>
                        </ListItemText>
                    </ListItem>

                    <ListItem sx={{ display: "list-item", mb: 2 }}>
                        <ListItemText>
                            <Typography variant="body1">You can now open Spotify app on your device to control the music playing.</Typography>
                            <Typography variant="body1">Please note, that this app CONTROLS only the Spotify music playing on your other main devices (phone / computer / music deck), it does not play music.</Typography>
                        </ListItemText>
                    </ListItem>
                </List>

            </Box>

            <Box sx={{ mb: 2 }}>
                <Typography variant="h5">Spotify Web API documentation</Typography>
                <Link target="_blank" href="https://developer.spotify.com/documentation/web-api">https://developer.spotify.com/documentation/web-api</Link>
            </Box>
        </Paper>
    );
}

export default Spotify;
