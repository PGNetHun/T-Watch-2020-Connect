import * as React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function Footer() {
    return (
        <Typography component="footer" variant="body2" color="text.secondary" sx={{ textAlign: "center", bottom: 0, width: "100%", p: 1 }}>
            {'Copyright © '}
            <Link color="inherit" href="https://github.com/PGNetHun">
                PGNetHun
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default Footer;