import React, { useEffect, useState } from 'react';
import { Button, Container, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

function App() {
  const [allDevices, setAllDevices] = useState([]);

  const fetchAllDevices = () => {
    fetch('http://127.0.0.1:5000/discover_all')
      .then(response => response.json())
      .then(data => {
        setAllDevices(data.devices);
      })
      .catch(error => {
        console.error('Error fetching all devices:', error);
      });
  };

  const connectToDevice = (address) => {
    // Logic to connect to the device using its address.
    // This can be updated based on how you plan to implement the connection logic.
    console.log("Connecting to device:", address);
  };

  useEffect(fetchAllDevices, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        All Devices
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allDevices.map(device => (
            <TableRow key={device.Address}>
              <TableCell>{device.Address}</TableCell>
              <TableCell>{device.Name}</TableCell>
              <TableCell align="right">
                <Button variant="contained" color="primary" onClick={() => connectToDevice(device.Address)}>
                  Connect to this Device
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default App;
