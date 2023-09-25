/** @jsxRuntime classic */
/** @jsxImportSource react */
/** @react client */

function BLEItem({ device, onSelect }) {
    return (
        <div className="p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-100" onClick={() => onSelect(device)}>
            <h2 className="text-xl font-bold">{device.name}</h2>
            <p className="text-gray-600">{device.address}</p>
        </div>
    );
}

export default BLEItem;
