import axios from 'axios';
import BASE_URL from './baseUrl';
import { joeBlow, joeBlowId } from '../mock-data/patients';

const PATIENT_URL = `${BASE_URL}Patient`;

export const searchPatient = async (queryTypes, queryValues) => {
  if (queryTypes.length !== queryValues.length)
    throw new Error('Invalid query. Unequal number of query types and query values.');

  const query = queryTypes.reduce(
    (queryStr, queryType, i) =>
      !!queryType ? `${queryStr}${queryType}=${queryValues[i]}&` : queryStr,
    ''
  );

  const fullUrl = `${PATIENT_URL}?${query}_format=json&_count=50`;
  const response = await axios.get(fullUrl);
  return response.data;
};

export const getPatient = async (id) => {
  if (id === joeBlowId) return joeBlow; // Need to use == here
  const fullUrl = `${PATIENT_URL}/${id}`;
  const response = await axios.get(fullUrl);
  return response.data;
};
