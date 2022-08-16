import axios from 'axios';

// Details about test servers here:
// https://www.notion.so/IPS-related-Servers-6acf8209fbfe484680c6a852b4292494
const BASE_URL = 'http://hapi.fhir.org/baseR4/';
const PATIENT_URL = `${BASE_URL}Patient`;

export const getPatient = async (queryType, queryValue) => {
  const fullUrl = `${PATIENT_URL}?${queryType}=${queryValue}&_format=json`;
  const response = await axios.get(fullUrl);

  return response.data;
};