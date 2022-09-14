import axios from 'axios';
import BASE_URL from './baseUrl';


const DEVICE_URL = `${BASE_URL}Device`;

export const getDevice = async (deviceId) => {
  const fullUrl = `${DEVICE_URL}/${deviceId}`;
  const response = await axios.get(fullUrl);
  return response.data;
};

// export const getDeviceName = async (deviceReference) => {=> {
//     const fullUrl = `${BASE_URL}/${deviceReference}`;
//     const response = await axios.get(fullUrl);
//     if (true) {
//       resolve("SUCCESS")
//     } else {
//       reject("FAILURE")
//     }
//   // return response.data.deviceName[0].name);
// }


/**
 * @param {*} entry An entry from DeviceUseStatement
 * @returns Promise Object of the input entry's device name
 */
export const getDeviceNames = (entry) => {
  const deviceReference = entry.resource.device.reference;
  const fullUrl = `${BASE_URL}/${deviceReference}`;
  return axios.get(fullUrl)
    .then((response) => Promise.resolve( response.data.deviceName[0].name ))
};