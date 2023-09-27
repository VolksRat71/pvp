import React from 'react';
import { Button } from 'react-native-paper';
import { searchDevices } from '../utils/bleManager';

const SearchForDevices = ({ onDevicesFound }) => {
    const handleSearch = async () => {
        const devices = await searchDevices();
        onDevicesFound(devices);
    };

    return (
        <Button mode="contained" onPress={handleSearch}>
            Search For Devices
        </Button>
    );
}

export default SearchForDevices;
