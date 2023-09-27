import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import { searchDevices } from '../utils/bleManager';

const SearchForDevices = ({ onDevicesFound }) => {
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        const devices = await searchDevices();
        onDevicesFound(devices);
        setLoading(false);
    };

    return (
        <View>
            <Button mode="contained" onPress={handleSearch} disabled={loading}>
                Search For Devices
            </Button>
            {loading && <ActivityIndicator style={{marginTop: 30}} animating={true} color="#186374" />}
        </View>
    );
}

export default SearchForDevices;
