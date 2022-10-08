import axios from 'axios';
import BASE_URL from './baseUrl';


const DEVICE_URL = `${BASE_URL}Device`;

export const getDevice = async (deviceId) => {
  const fullUrl = `${DEVICE_URL}/${deviceId}`;
  const response = await axios.get(fullUrl);
  return response.data;
};

/**
 * @param {*} entry An entry from DeviceUseStatement
 * @returns Promise Object of the input entry's device name
 */
export const getDeviceNames = (entry) => {
  if (!entry.resource.device) return 'N/A';

  const deviceReference = entry.resource.device.reference;
  const fullUrl = `${BASE_URL}/${deviceReference}`;
  const deviceName = axios.get(fullUrl)
    // .then((response) => console.log('Device names response:', response.data.deviceName[0].name))
    .then((response) => response.data.deviceName? response.data.deviceName[0].name : 'N/A')
    .then((deviceName) => Promise.resolve(deviceName)
    )
  return deviceName;
};
