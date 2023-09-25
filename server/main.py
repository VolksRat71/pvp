import asyncio
from bleak import BleakScanner

async def discover_all_devices():
    print("Searching for all Bluetooth Low Energy devices...")
    devices = await BleakScanner.discover()
    for device in devices:
        print(f"Address: {device.address}, Name: {device.name}")

async def discover_powrlabs_device():
    print("\nSearching for Powrlabs_0466580 device...")
    devices = await BleakScanner.discover()
    for device in devices:
        if device.name == "Powrlabs_0466580":
            print(f"Address: {device.address}, Name: {device.name}")

if __name__ == "__main__":
    asyncio.run(discover_all_devices())
    asyncio.run(discover_powrlabs_device())
