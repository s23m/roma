import axios from 'axios';
import BASE_URL from './baseUrl';
import { joeBlow, joeBlowId } from '../mock-data/patients';

const PATIENT_URL = `${BASE_URL}Patient`;

export const searchPatient = async (queryParam, queryValue) => {
  const fullUrl = `${PATIENT_URL}?${queryParam}=${queryValue}&_format=json&_count=50`;
  const response = await axios.get(fullUrl);
  return response.data;
};

export const getPatient = async (id) => {
  if (id == joeBlowId) return joeBlow; // Need to use == here
  const fullUrl = `${PATIENT_URL}/${id}`;
  const response = await axios.get(fullUrl);
  return response.data;
};
