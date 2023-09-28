import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { NativeRouter, Route, Link, Routes } from 'react-router-native';
import { Provider as PaperProvider, Appbar, Button, Drawer } from 'react-native-paper';
import SearchForDevices from './components/SearchForDevices';
import DarkTheme from './theme/DarkTheme';
import Landing from './views/Landing.js'
import Profile from './views/Profile.js'
import Settings from './views/Settings.js'
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

export default function App() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [active, setActive] = React.useState('');
    const [isFontLoaded, setFontLoaded] = useState(false);

    const loadFonts = async () => {
        await Font.loadAsync({
            'PokemonClassic': require('./assets/Pokemon_Classic.ttf'),
        });
    };

    useEffect(() => { loadFonts().then(() => setFontLoaded(true)) }, []);

    return (
        <PaperProvider theme={DarkTheme}>
            <NativeRouter>
                <Appbar.Header>
                    <Appbar.Content title="PVP" />
                    <Appbar.Action icon="menu" onPress={() => setDrawerOpen(!drawerOpen)} />
                </Appbar.Header>

                {drawerOpen && (
                    <ScrollView style={{ width: 250, backgroundColor: '#fff' }}>
                        <Drawer.Section>
                            <Link to="/" onPress={() => {
                                setDrawerOpen(false)
                                setActive('landing')
                            }}>
                                <Drawer.Item
                                    label="Landing Page"
                                    active={active === 'landing'}
                                />
                            </Link>
                            <Link to="/profile" onPress={() => {
                                setDrawerOpen(false)
                                setActive('profile')
                            }}>
                                <Drawer.Item
                                    label="Profile"
                                    active={active === 'profile'}
                                />
                            </Link>
                            <Link to="/settings" onPress={() => {
                                setDrawerOpen(false);
                                setActive('settings')
                            }}>
                                <Drawer.Item
                                    label="Settings"
                                    active={active === 'settings'}
                                />
                            </Link>
                        </Drawer.Section>
                    </ScrollView>
                )}


                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    {/* Linked in Settings */}
                    <Route path="/search" element={<SearchForDevices />} />
                    <Route path="*" element={<View><Text>404</Text></View>} />
                </Routes>
            </NativeRouter>
        </PaperProvider>
    );
}
