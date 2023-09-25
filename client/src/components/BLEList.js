/** @jsxRuntime classic */
/** @jsxImportSource react */
/** @react client */

import BLEItem from './BLEItem';

function BLEList({ devices, onSelect }) {
    return (
        <div className="max-w-md mx-auto mt-10 shadow-lg">
            {devices.map(device => (
                <BLEItem key={device.address} device={device} onSelect={onSelect} />
            ))}
        </div>
    );
}

export default BLEList;
