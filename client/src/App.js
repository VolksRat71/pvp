import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Container, Table, TableBody, TableCell, TableHead, TableRow, Typography, Box } from '@mui/material';

function App() {
  const [allDevices, setAllDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllDevices = () => {
    setIsLoading(true);
    fetch('http://127.0.0.1:5000/discover_all')
      .then(response => response.json())
      .then(data => {
        setAllDevices(data.devices);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching all devices:', error);
        setIsLoading(false);
      });
  };

  const connectToDevice = (address) => {
    console.log("Connecting to device:", address);
  };

  useEffect(() => {
    // Initially load the devices when the component mounts
    fetchAllDevices();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        All Devices
      </Typography>

      <Box display="flex" justifyContent="center" marginBottom="20px">
        <Button variant="contained" color="primary" onClick={fetchAllDevices}>
          Discover All Devices
        </Button>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
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
      )}
    </Container>
  );
}

export default App;
