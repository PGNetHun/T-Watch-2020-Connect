import * as React from "react";
import { Outlet } from "react-router-dom";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Box, Toolbar, Container, Drawer, AppBar, List, Typography, Divider,
  IconButton, ListItemButton, ListItemIcon, ListItemText, Tooltip
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import InfoIcon from "@mui/icons-material/Info";
import AppsIcon from "@mui/icons-material/Apps";
import CodeIcon from "@mui/icons-material/Code";
import WatchIcon from "@mui/icons-material/Watch";
import KeyIcon from "@mui/icons-material/Key";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { deleteToken } from "../redux/deviceSlice";
import Footer from "./Footer";

const menuItems = [
  { name: "Info", icon: <InfoIcon />, route: "/info" },
  { name: "Apps", icon: <AppsIcon />, route: "/apps" },
  { name: "Faces", icon: <WatchIcon />, route: "/faces" },
  { name: "Files", icon: <FolderIcon />, route: "/files" },
  { name: "Settings", icon: <SettingsIcon />, route: "/settings" },
  { name: "KeyVault", icon: <KeyIcon />, route: "/keyvault" },
  { name: "Commands", icon: <CodeIcon />, route: "/commands" },
]

const mdTheme = createTheme();

const drawerWidth = 240;

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    "& .MuiDrawer-paper": {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: "border-box",
      ...(!open && {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const StyledNavLink = styled(NavLink)(
  ({ theme }) => ({
    textDecoration: "None",
    color: theme.palette.text.primary,
    display: "flex",
    "&.active": {
      color: "#0072E5",
      backgroundColor: "#F0F7FF"
    }
  }));

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { device } = useSelector((state) => state);

  const [open, setOpen] = React.useState(true);
  const [activeName, setActiveName] = React.useState(menuItems[0].name);

  React.useEffect(() => {
    const menuItem = menuItems.find(x => x.route == location.pathname);
    setActiveName(menuItem?.name || "")
  }, [location]);

  function toggleDrawer() {
    setOpen(!open);
  }

  function disconnect() {
    dispatch(deleteToken());
    navigate("/");
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <StyledAppBar component="header" position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {activeName}
            </Typography>
            <Typography sx={{ textAlign: "right" }}>
              {`Device: ${device.url}`}
            </Typography>
            <Tooltip title="Disconnect device" placement="left">
              <IconButton
                aria-label="disconnect device"
                color="inherit"
                onClick={disconnect}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </StyledAppBar>
        <StyledDrawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {menuItems.map((item, index) =>
              <StyledNavLink key={index} to={item.route} aria-label={`open ${item.name}`} onClick={() => setActiveName(item.name)}>
                <ListItemButton>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </StyledNavLink>
            )}
          </List>
        </StyledDrawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto"
          }}
        >
          <Toolbar />
          <Container component="article" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Outlet></Outlet>
          </Container>
          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Layout;
