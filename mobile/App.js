
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Appbar, Button, DataTable, Provider as PaperProvider } from 'react-native-paper';

const dummyData = [
    { address: '192.168.1.1', name: 'Device 1' },
    { address: '192.168.1.2', name: 'Device 2' },
    { address: '192.168.1.3', name: 'Device 3' },
];

export default function App() {
    return (
        <PaperProvider>
            <View style={{ flex: 1 }}>
                <Appbar.Header>
                    <Appbar.Content title="Player VS Player" />
                </Appbar.Header>
                <ScrollView style={{ padding: 20 }}>
                    <Button mode="contained" style={{ marginBottom: 20 }} onPress={() => {}}>
                        Search For Devices
                    </Button>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>Address</DataTable.Title>
                            <DataTable.Title>Name</DataTable.Title>
                        </DataTable.Header>
                        {dummyData.map((device, index) => (
                            <DataTable.Row key={index}>
                                <DataTable.Cell>{device.address}</DataTable.Cell>
                                <DataTable.Cell>{device.name}</DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
                </ScrollView>
            </View>
        </PaperProvider>
    );
}
