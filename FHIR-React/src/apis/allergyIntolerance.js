import axios from 'axios';

// Details about test servers here:
// https://www.notion.so/IPS-related-Servers-6acf8209fbfe484680c6a852b4292494
// const BASE_URL = 'http://hapi.fhir.org/baseR4/'
const BASE_URL = 'https://server.fire.ly/';
const ALLERGYINTOLERANCE_URL = `${BASE_URL}AllergyIntolerance`;

export const getAllergyIntolerance = async (patientId) => {
  const fullUrl = `${ALLERGYINTOLERANCE_URL}?patient=${patientId}`;
  const response = await axios.get(fullUrl);
  return response.data;
};