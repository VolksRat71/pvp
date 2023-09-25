from flask import Flask, jsonify
from flask_cors import CORS  # Importing CORS
import asyncio
from bleak import BleakScanner

app = Flask(__name__)
CORS(app)  # Applying CORS to the Flask app to allow requests from any origin

@app.route('/discover_all', methods=['GET'])
def discover_all():
    devices_list = asyncio.run(discover_all_devices_wrapper())
    return jsonify(devices=devices_list)

@app.route('/discover_powrlabs', methods=['GET'])
def discover_powrlabs():
    device_info = asyncio.run(discover_powrlabs_device_wrapper())
    return jsonify(device=device_info)

async def discover_all_devices_wrapper():
    devices_list = []
    devices = await BleakScanner.discover()
    for device in devices:
        devices_list.append({
            "Address": device.address,
            "Name": device.name
        })
    return devices_list

async def discover_powrlabs_device_wrapper():
    devices = await BleakScanner.discover()
    for device in devices:
        if device.name == "Powrlabs_0466566":
            return {
                "Address": device.address,
                "Name": device.name
            }
    return None

if __name__ == '__main__':
    app.run(port=5000)
