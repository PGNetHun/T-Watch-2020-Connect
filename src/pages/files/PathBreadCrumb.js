import * as React from "react";
import { Breadcrumbs, Chip } from "@mui/material";
import { emphasize, styled } from '@mui/material/styles';
import HomeIcon from "@mui/icons-material/Home";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(4),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
  };
});

function PathBreadCrumb({ path, navigatePath }) {
  let partPath = "";
  const pathParts = path.split("/").filter(name => !!name).map(name => {
    partPath += "/" + name;
    return { name: name, path: partPath };
  });

  return (
    <Breadcrumbs>
      <StyledBreadcrumb
        component="a"
        label="Home"
        icon={<HomeIcon fontSize="small" />}
        onClick={() => navigatePath("/")}
      />
      {pathParts.map(({ name, path }, index) =>
        (<StyledBreadcrumb key={index} component="a" label={name} onClick={() => navigatePath(path)}></StyledBreadcrumb>)
      )}
    </Breadcrumbs>
  );
}

export default PathBreadCrumb;
