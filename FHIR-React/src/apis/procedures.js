import axios from 'axios';
import BASE_URL from './baseUrl';

const PROCEDURE_URL = `${BASE_URL}Procedure`;

export const getPatientProcedures = async (patientId) => {
  const fullUrl = `${PROCEDURE_URL}?patient=${patientId}`;
  const response = await axios.get(fullUrl);
  return response.data;
};
