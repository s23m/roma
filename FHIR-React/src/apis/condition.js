import axios from 'axios';
import BASE_URL from './baseUrl';

const CONDITION_URL = `${BASE_URL}Condition`;

export const getCondition = async (patientId) => {
  const fullUrl = `${CONDITION_URL}?patient=${patientId}&_count=1000`;
  const response = await axios.get(fullUrl);
  return response.data;
};
