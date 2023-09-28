import React from 'react';
import { View, Text, Button } from 'react-native';
import { Link} from 'react-router-native';

function Settings() {
    // const navigation = useNavigation();
    return (
        <View>
            <Text>Settings</Text>

            <Button mode="contained" onPress={() => window.location.href("/search")} title='Search For Devices' />
        </View>
    );
}

export default Settings;
