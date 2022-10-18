import axios from 'axios';
import BASE_URL from './baseUrl';


const DEVICEUSESTATEMENT_URL = `${BASE_URL}DeviceUseStatement`;

export const getDeviceUseStatement = async (patientId) => {
  // Construct fullUrl 
  const fullUrl = `${DEVICEUSESTATEMENT_URL}?patient=${patientId}&_count=1000`;
  
  // Request and return response data 
  const response = await axios.get(fullUrl);
  return response.data;
};