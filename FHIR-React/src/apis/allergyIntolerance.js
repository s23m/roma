import axios from 'axios';
import BASE_URL from './baseUrl';


const ALLERGYINTOLERANCE_URL = `${BASE_URL}AllergyIntolerance`;

export const getAllergyIntolerance = async (patientId) => {
  const fullUrl = `${ALLERGYINTOLERANCE_URL}?patient=${patientId}`;
  const response = await axios.get(fullUrl);
  return response.data;
};