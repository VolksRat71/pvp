import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';

import Alien_GIF from '../assets/Alien_GIF.gif';
import Robot_GIF from '../assets/Robot_GIF.gif';
import Cowboy_GIF from '../assets/Cowboy_GIF.gif';

function Landing() {
    return (
        <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 24, textAlign: 'center', marginTop: 20 }}>
                Select Alliance
            </Text>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={{ flex: 1, marginTop: 20 }}
            >

                <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
                    <Image source={Robot_GIF} style={{ width: '100%', height: 50, resizeMode: 'contain' }} />
                    <Text style={{ marginTop: 10, fontSize: 20 }}>Robot</Text>
                </View>

                <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
                    <Image source={Alien_GIF} style={{ width: '100%', height: 50, resizeMode: 'contain' }} />
                    <Text style={{ marginTop: 10, fontSize: 20 }}>Alien</Text>
                </View>

                <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
                    <Image source={Cowboy_GIF} style={{ width: '100%', height: 50, resizeMode: 'contain' }} />
                    <Text style={{ marginTop: 10, fontSize: 20 }}>Cowboy</Text>
                </View>

            </ScrollView>
        </View>
    );
}

export default Landing;
