import axios from 'axios';
import BASE_URL from './baseUrl';


const DIAGNOSTICREPORT_URL = `${BASE_URL}DiagnosticReport`;

export const getDiagnosticReport = async (patientId) => {
  const fullUrl = `${DIAGNOSTICREPORT_URL}?patient=${patientId}`;
  const response = await axios.get(fullUrl);
  return response.data;
};