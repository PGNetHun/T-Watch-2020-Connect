import * as React from "react";
import { useDispatch } from "react-redux";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Paper, Typography } from "@mui/material";
import { set as setCallbackState } from "../../redux/callbackSlice";

const redirects = {
  "spotify": "/apps/settings/spotify"
}

function Callback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const urlParams = useParams();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    const id = urlParams?.id;
    if (!id || !(id in redirects)) {
      return;
    }

    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    dispatch(setCallbackState({ id: id, params: params }));

    navigate(redirects[id]);
  }, [urlParams]);

  return (
    <Paper sx={{ textAlign: "center", p: 4 }}>
      <Typography variant="h4" marginBottom={2}>Callback page</Typography>
      <Typography variant="body1">Unknown callback ID: {urlParams?.id}</Typography>
    </Paper>
  );
}

export default Callback;
