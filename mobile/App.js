import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { NativeRouter, Route, Link, Routes } from 'react-router-native';
import { Provider as PaperProvider, Appbar, Button } from 'react-native-paper';
import DarkTheme from './theme/DarkTheme';

function FirstItem() {
    return <View><Text>Landing Page</Text></View>;
}

function SecondItem() {
    return <View><Text>Second Item View</Text></View>;
}

function ThirdItem() {
    return <View><Text>Third Item View</Text></View>;
}

export default function App() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    return (
        <PaperProvider theme={DarkTheme}>
            <NativeRouter>
                <Appbar.Header>
                    <Appbar.Content title="App" />
                    <Appbar.Action icon="menu" onPress={() => setDrawerOpen(!drawerOpen)} />
                </Appbar.Header>

                {drawerOpen && (
                    <ScrollView style={{ width: 250, backgroundColor: '#fff' }}>
                        <Link to="/" onPress={() => setDrawerOpen(false)}>
                            <View><Button>Landing</Button></View>
                        </Link>
                        <Link to="/second" onPress={() => setDrawerOpen(false)}>
                            <View><Button>Second Item</Button></View>
                        </Link>
                        <Link to="/third" onPress={() => setDrawerOpen(false)}>
                            <View><Button>Third Item</Button></View>
                        </Link>
                    </ScrollView>
                )}


                <Routes>
                    <Route path="/" element={<FirstItem />} />
                    <Route path="/second" element={<SecondItem />} />
                    <Route path="/third" element={<ThirdItem />} />""
                </Routes>
            </NativeRouter>
        </PaperProvider>
    );
}
