import * as React from "react";
import { Box, Link } from "@mui/material";

function NoPage() {
  return (
    <Box textAlign="center">
      <Link href="/">
        <Box
          component="img"
          alt="404 - Page not found"
          src="/images/404.png"></Box>
      </Link>
    </Box>
  );
}

export default NoPage;
