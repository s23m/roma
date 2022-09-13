import axios from 'axios';
import BASE_URL from './baseUrl';


const DEVICE_URL = `${BASE_URL}Device`;

export const getDevice = async (deviceId) => {
  const fullUrl = `${DEVICE_URL}/${deviceId}`;
  const response = await axios.get(fullUrl);
  return response.data;
};

export const getDeviceName = async (deviceReference) => {
  const fullUrl = `${BASE_URL}/${deviceReference}`;
  const response = await axios.get(fullUrl);
  return response.data.deviceName[0].name;
};