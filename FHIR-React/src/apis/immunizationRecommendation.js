import axios from 'axios';
import BASE_URL from './baseUrl';


const IMMUNIZATIONRECOMMENDATION_URL = `${BASE_URL}ImmunizationRecommendation`;

export const getImmunizationRecommendation = async (patientId) => {
  const fullUrl = `${IMMUNIZATIONRECOMMENDATION_URL}?patient=${patientId}&_count=1000`;
  const response = await axios.get(fullUrl);
  return response.data;
};