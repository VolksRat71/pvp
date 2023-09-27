// ./App.js

import React from 'react';
import { View } from 'react-native';
import { Appbar, Provider as PaperProvider } from 'react-native-paper';
import DeviceConnection from './views/DeviceConnection';
import DarkTheme from './theme/DarkTheme';

export default function App() {
    return (
        <PaperProvider theme={DarkTheme}>
            <View style={{ flex: 1 }}>
                <Appbar.Header>
                    <Appbar.Content title="Player VS Player" />
                </Appbar.Header>
                <DeviceConnection />
            </View>
        </PaperProvider>
    );
}
