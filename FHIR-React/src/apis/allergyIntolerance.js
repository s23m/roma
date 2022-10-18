import axios from 'axios';
import BASE_URL from './baseUrl';

const ALLERGYINTOLERANCE_URL = `${BASE_URL}AllergyIntolerance`;

export const getAllergyIntolerance = async (patientId) => {
  // Construct fullUrl 
  const fullUrl = `${ALLERGYINTOLERANCE_URL}?patient=${patientId}&_count=1000`;
  
  // Request and return response data 
  const response = await axios.get(fullUrl);
  return response.data;
};
