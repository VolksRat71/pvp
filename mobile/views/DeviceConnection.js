// ./views/DeviceConnection.js

import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, Animated } from 'react-native';
import { DataTable } from 'react-native-paper';
import SearchForDevices from '../components/SearchForDevices';
import { searchDevices } from '../utils/bleManager';

const DeviceConnection = () => {
    const [devices, setDevices] = useState([]);
    const slideAnim = useRef(new Animated.Value(0)).current;  // Initial value for translateY: 0

    const slideAway = () => {
        // Slide out animation
        Animated.timing(
            slideAnim,
            {
                toValue: -500,
                duration: 500,
                useNativeDriver: true
            }
        ).start();
    };

    const slideIn = () => {
        // Slide in animation
        Animated.timing(
            slideAnim,
            {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true
            }
        ).start();
    };

    const handleSearch = async () => {
        slideAway();
        setDevices([]);  // Clear the devices

        // Simulating a delay for the search (can be removed if the search is naturally slow)
        setTimeout(async () => {
            const foundDevices = await searchDevices();
            setDevices(foundDevices);
            slideIn();
        }, 1000);
    };

    return (
        <ScrollView style={{ padding: 20 }}>
            <SearchForDevices onDevicesFound={handleSearch} />
            <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
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
            </Animated.View>
        </ScrollView>
    );
}

export default DeviceConnection;
