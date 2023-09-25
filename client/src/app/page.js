/** @jsxRuntime classic */
/** @jsxImportSource react */
/** @react client */

import { useState } from 'react';
import BLEList from '../components/BLEList';

export default function Page() {
  const [devices, setDevices] = useState([
    // Mock data for now
    { name: 'Device 1', address: 'ABC123' },
    { name: 'Device 2', address: 'DEF456' },
  ]);

  const handleSelect = (device) => {
    console.log('Selected device:', device);
    // Handle device selection logic here
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Select a BLE Device</h1>
      <BLEList devices={devices} onSelect={handleSelect} />
    </div>
  );
}
