import axios from 'axios';
import BASE_URL from './baseUrl';


const DIAGNOSTICREPORT_URL = `${BASE_URL}DiagnosticReport`;

export const getDiagnosticReport = async (patientId) => {
  // Construct fullUrl 
  const fullUrl = `${DIAGNOSTICREPORT_URL}?patient=${patientId}&_count=1000`;
  
  // Request and return response data 
  const response = await axios.get(fullUrl);
  return response.data;
};