import asyncio
from bleak import BleakScanner

async def discover_devices():
    print("Searching for Bluetooth Low Energy devices...")
    devices = await BleakScanner.discover()
    print(f"Found {len(devices)} devices.")
    for device in devices:
        print(f"Address: {device.address}, Name: {device.name}")

if __name__ == "__main__":
    asyncio.run(discover_devices())
