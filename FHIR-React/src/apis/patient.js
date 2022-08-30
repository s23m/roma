import axios from 'axios';
import BASE_URL from './baseUrl';


const PATIENT_URL = `${BASE_URL}Patient`;

export const searchPatient = async (queryType, queryValue) => {
  const fullUrl = `${PATIENT_URL}?${queryType}=${queryValue}&_format=json`;
  const response = await axios.get(fullUrl);
  return response.data;
};

export const getPatient = async (id) => {
  const fullUrl = `${PATIENT_URL}/${id}`;
  const response = await axios.get(fullUrl);
  return response.data;
};
