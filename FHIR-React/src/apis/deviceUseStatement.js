import axios from 'axios';
import BASE_URL from './baseUrl';


const DEVICEUSESTATEMENT_URL = `${BASE_URL}DeviceUseStatement`;

export const getDeviceUseStatement = async (patientId) => {
  const fullUrl = `${DEVICEUSESTATEMENT_URL}?patient=${patientId}&_count=1000`;
  const response = await axios.get(fullUrl);
  return response.data;
};