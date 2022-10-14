import axios from 'axios';
import BASE_URL from './baseUrl';

const PROCEDURE_URL = `${BASE_URL}Procedure`;

export const getPatientProcedures = async (patientId) => {
  // Construct fullUrl 
  const fullUrl = `${PROCEDURE_URL}?patient=${patientId}&_count=1000`;
  
  // Request and return response data 
  const response = await axios.get(fullUrl);
  return response.data;
};
