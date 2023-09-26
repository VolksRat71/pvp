import React, { useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  Collapse,
  Snackbar,
  CssBaseline,
  ThemeProvider,
  styled,
  createTheme,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

const appTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#186374', // Primary blue shade for primary actions
    },
    secondary: {
      main: '#B4483E', // Reddish shade for secondary actions
    },
    error: {
      main: '#F24822', // Bright red for error or accent highlights
    },
    background: {
      default: '#02202B', // Darkest shade for background
      paper: '#082F39', // Slightly lighter shade for contrast elements like cards
    },
  },
  typography: {
    fontFamily: '"Tron", "Arial", sans-serif', // Placeholder for Tron-like font
  },
});

const StyledSnackbarContent = styled('div')`
  background-color: ${({ theme }) => theme.palette.secondary.main};
`;

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [allDevices, setAllDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState({ data: null, open: false });

  const fetchAllDevices = () => {
    setIsLoading(true);
    fetch('http://127.0.0.1:5000/discover_all')
      .then(response => response.json())
      .then(data => {
        const devices = data.devices.map((device) =>
        ({
          isConnecting: false,
          isConnected: false,
          ...device
        })
        );
        setAllDevices(devices);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching all devices:', error);
        setIsLoading(false);
      });
  };

  const resolveConnection = (i) => {
    const newDevices = [...allDevices];
    newDevices[i].isConnecting = false;
    newDevices[i].isConnected = true;
    setAllDevices(newDevices);
  }

  const connectToDevice = async (address, i) => {
    const newDevices = [...allDevices];
    newDevices[i].isConnecting = true;
    setAllDevices(newDevices);

    try {
      const response = await fetch(`http://127.0.0.1:5000/connect/${address}`);
      const data = await response.json();
      if (data.status === "success") {
        console.log(data.message);
        setConnectedDevice({ data: newDevices[i], open: true });
      } else {
        console.error(data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Error connecting to device:", error);
      alert("Error connecting to device. Please check the console for more details.");
    } finally {
      resolveConnection(i);
    }
  };

  useEffect(() => {
    // Initially load the devices when the component mounts
    fetchAllDevices();
  }, []);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Container>
        <Typography variant="h4" gutterBottom align="center" color="secondary">
          Player VS Player
        </Typography>

        <Box display="flex" justifyContent="center" marginBottom="20px">
          <Button
            variant="contained"
            color="primary"
            onClick={fetchAllDevices}
            disabled={isLoading}
          >
            Discover All Devices
          </Button>
        </Box>

        <Collapse in={isLoading}>
          <Box display="flex" justifyContent="center">
            <CircularProgress color="primary" />
          </Box>
        </Collapse>
        <Collapse in={!isLoading}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allDevices.map((device, i) => (
                <TableRow  key={`${device.Address.slice(0, 4)}${Number(i)}`}>
                <TableCell style={isMobile ? { maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {}}>{device.Address}</TableCell>
                <TableCell style={isMobile ? { maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {}}>{device.Name}</TableCell>
                  <TableCell align="right">
                    <LoadingButton
                      variant="contained"
                      size='small'
                      color={device.isConnected ? "secondary" : "primary"}
                      loading={device.isConnecting}
                      disabled={device.isConnected}
                      onClick={() => connectToDevice(device.Address, i)}
                    >
                      {device.isConnected ? "Connected" : "Connect"}
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Collapse>
      </Container>
      <Snackbar
        color='secondary'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={connectedDevice.open}
        onClose={() => setConnectedDevice({ ...connectedDevice, open: false })}
        autoHideDuration={4000}
        message={`Connected to ${connectedDevice.data?.Name}`}
        ContentProps={{ component: StyledSnackbarContent } }
      />
    </ThemeProvider>
  );
}

export default App;
