import * as React from "react";
import PropTypes from 'prop-types';
import { Box, Tabs, Tab } from "@mui/material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

function TabPanel(props) {
    const { children, index, value, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value != index}
            id={`tabpanel-${index}`}
            sx={{ width: "100%" }}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </Box>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
}

function TabsContext({ parentPath = "", tabs, useContent = false, orientation = "horizontal", containerProps, tabsProps, tabProps, tabPanelProps }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [tabId, setTabId] = React.useState(0);

    React.useEffect(() => {
        const index = tabs.findIndex(tab => pathname.startsWith(`/${parentPath}/${tab.route}`));
        if (index < 0) {
            navigate(tabs[0].route);
        }
        else {
            setTabId(index);
        }
    }, [pathname, tabId]);

    const containerSx = orientation == "vertical"
        ? { flexGrow: 1, bgcolor: 'background.paper', display: 'flex', width: "100%" }
        : {};

    const tabsSx = orientation == "vertical"
        ? { borderRight: 1, borderColor: 'divider', minWidth: "10em" }
        : {};

    return (
        <Box sx={containerSx} {...containerProps}>
            <Tabs
                orientation={orientation}
                value={tabId}
                onChange={(event, index) => setTabId(index)}
                sx={tabsSx}
                {...tabsProps}
            >
                {tabs.map((tab, index) =>
                    <Tab
                        key={index}
                        value={index}
                        label={tab.name}
                        aria-label={`open ${tab.name} tab`}
                        icon={tab.icon}
                        iconPosition="start"
                        to={tab.route}
                        component={Link}
                        {...tabProps}
                    />
                )}
            </Tabs>
            {
                useContent
                    ? tabs.map((tab, index) =>
                        <TabPanel key={index} index={index} value={tabId} {...tabPanelProps}>
                            {tab.content}
                        </TabPanel>
                    )
                    : <TabPanel index={tabId} value={tabId} {...tabPanelProps}>
                        <Outlet />
                    </TabPanel>
            }


        </Box>
    );
}

TabsContext.propTypes = {
    orientation: PropTypes.string,
    tabs: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        icon: PropTypes.element,
        // content: PropTypes.element.isRequired
    })).isRequired,
    containerProps: PropTypes.object,
    tabsProps: PropTypes.object,
    tabProps: PropTypes.object,
    tabPanelProps: PropTypes.object
}

export default TabsContext;
