import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

export const initializeManager = () => {
    // No specific initialization needed for this library.
    // However, you can add any setup code here if required.
}

export const finalizeManager = () => {
    // Cleanup logic if needed
    // This can involve removing listeners or other resources.
}

export const searchDevices = () => {
    return new Promise((resolve, reject) => {
        const devicesFound = [];

        // Start scanning
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                // Handle error
                console.error(error);
                reject(error);
                return;
            }

            // Check for the device you are interested in
            // For this example, we're simply adding the device to our array
            devicesFound.push(device);
        });

        // Stop scanning after 10 seconds and resolve the promise
        setTimeout(() => {
            manager.stopDeviceScan();
            resolve(devicesFound);
        }, 10000);
    });
}

// ... Other BLE related functions
