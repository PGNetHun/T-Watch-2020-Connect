import * as React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux"
import { setToken, setUrlAndAuthCode } from "../../redux/deviceSlice";
import { useConnectMutation } from "../../api/deviceApi"

const mdTheme = createTheme();

function Authentication() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { device } = useSelector(state => state);

  const [connect, { isLoading: isConnecting }] = useConnectMutation();

  // Get device URL and authentication code from query parameters
  const [searchParams] = useSearchParams();
  const queryUrl = searchParams.get("url");
  const queryAuthCode = searchParams.get("code");

  const [url, setUrl] = React.useState(queryUrl || device.url);
  const [authcode, setAuthCode] = React.useState(queryAuthCode || device.authcode);

  const onSubmit = async (event) => {
    event.preventDefault();
    dispatch(setUrlAndAuthCode({ url, authcode }));

    connect(authcode)
      .unwrap()
      .then(result => {
        dispatch(setToken({ token: result.token }));
        navigate("/info");
      });
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          component="form"
          onSubmit={onSubmit}
          noValidate
        >
          <Box sx={{ display: "flex", flexFlow: "column", alignItems: "center", gap: 2 }}>
            <Typography variant="h4" align="center" sx={{ mb: "1em" }}>T-Watch-2020 Connect</Typography>
            <TextField required name="url" label="Device URL" variant="outlined" onChange={(e) => setUrl(e.target.value)} value={url} disabled={isConnecting} />
            <TextField required name="authcode" label="Authentication code" variant="outlined" onChange={(e) => setAuthCode(e.target.value)} value={authcode} disabled={isConnecting} />
            <Button variant="contained" type="submit" sx={{ minWidth: "10em" }} disabled={isConnecting}>Connect</Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Authentication;
