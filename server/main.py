from flask import Flask, jsonify
from flask_cors import CORS  # Importing CORS
import asyncio
from bleak import BleakScanner
from bleak import BleakClient
from flask_sse import sse

app = Flask(__name__)
CORS(app)  # Applying CORS to the Flask app to allow requests from any origin


app.config["REDIS_URL"] = "redis://localhost"
app.register_blueprint(sse, url_prefix='/stream')

@app.route('/get_data_stream')
def get_data_stream():
    while True:
        data_from_ble_device = get_data_from_ble_device()  # Replace this with your data fetching logic
        sse.publish({"message": data_from_ble_device}, type='dataUpdate')

@app.route('/connect/<address>', methods=['GET'])
def connect_device(address):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(connect_device_async(address))
    return jsonify(result)

async def connect_device_async(address):
    async with BleakClient(address) as client:
        if client.is_connected:
            return {"status": "success", "message": f"Connected to device {address}"}
        else:
            return {"status": "error", "message": f"Failed to connect to device {address}"}

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
