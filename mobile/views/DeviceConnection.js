// ./views/DeviceConnection.js

import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { DataTable } from 'react-native-paper';
import SearchForDevices from '../components/SearchForDevices';

const DeviceConnection = () => {
    const [devices, setDevices] = useState([]);

    const handleDevicesFound = (foundDevices) => {
        setDevices(foundDevices);
    };

    return (
        <ScrollView style={{ padding: 20 }}>
            <SearchForDevices onDevicesFound={handleDevicesFound} />
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Address</DataTable.Title>
                    <DataTable.Title>Name</DataTable.Title>
                </DataTable.Header>
                {devices.map((device, index) => (
                    <DataTable.Row key={index}>
                        <DataTable.Cell>{device.address}</DataTable.Cell>
                        <DataTable.Cell>{device.name}</DataTable.Cell>
                    </DataTable.Row>
                ))}
            </DataTable>
        </ScrollView>
    );
}

export default DeviceConnection;
