import * as React from "react";
import { useSelector } from 'react-redux'
import { Paper, TableContainer, Table, TableRow, TableBody, TableCell, Typography } from "@mui/material";
import { useGetInfoQuery } from "../../api/deviceApi";

function Dashboard() {
  const { data } = useGetInfoQuery();
  const [properties, setProperties] = React.useState([]);
  const deviceUrl = useSelector(state => state.device.url);

  React.useEffect(() => {
    if (data) {
      const props = [];
      props.push(["ID", data.id]);
      props.push(["URL", deviceUrl]);
      props.push(["Name", data.name]);
      props.push(["Type", data.type]);
      props.push(["Owner", data.owner.name]);
      if (data.display) {
        props.push(["Display", `${data.display.width} x ${data.display.height} pixels (${data.display.pixel_format}, ${data.display.pixel_bits} bits)`]);
      }
      if (data.battery) {
        const status = data.battery["is_fully_charged"] === true
          ? "(Fully charged)"
          : (data.battery["is_charging"] ? "(Charging)" : "")
        props.push(["Battery percent", `${data.battery.percent} % ${status}`]);
      }
      setProperties(props);
    }

  }, [data, deviceUrl]);

  return (
    <>
      <Typography component="h2" variant="h4" align="center" sx={{ mb: 1 }}>Device info</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {properties.map(([name, value], index) => (
              <TableRow key={index}>
                <TableCell align="right">{name}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Dashboard;
