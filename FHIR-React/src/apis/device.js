import axios from 'axios';
import BASE_URL from './baseUrl';


const DEVICE_URL = `${BASE_URL}Device`;

export const getDevice = async (deviceId) => {
  const fullUrl = `${DEVICE_URL}/${deviceId}`;
  const response = await axios.get(fullUrl);
  return response.data;
};

/**
 * Get the device name given the reference
 * `reference` could look like: 'Device/123'
 * @param {Object} entry An entry from getDeviceUseStatement in api/deviceUseStatement.js
 * @returns Promise Object of the input entry's device name
 */
export const getDeviceNames = (entry) => {
  if (!entry.resource.device) return 'N/A';

  // Construct fullUrl 
  const deviceReference = entry.resource.device.reference;
  const fullUrl = `${BASE_URL}${deviceReference}`;
  
  // Request and return response data 
  const deviceName = axios.get(fullUrl)
    // .then((response) => console.log('Device names response:', response.data.deviceName[0].name))
    .then((response) => response.data.deviceName? response.data.deviceName[0].name : 'N/A')
    .then((deviceName) => Promise.resolve(deviceName)
    )
  return deviceName;
};
