import axios from 'axios';
import BASE_URL from './baseUrl';
import { joeBlow, joeBlowId } from '../mock-data/patients';

// Add targeted endpoint
const PATIENT_URL = `${BASE_URL}Patient`;

/**
 * Get patient search results from a set of parameter values
 * @param {Array} queryTypes 
 * @param {Array} queryValues 
 * @returns response data
 */
export const searchPatient = async (queryTypes, queryValues) => {
  if (queryTypes.length !== queryValues.length)
  throw new Error('Invalid query. Unequal number of query types and query values.');
  
  // Construct fullUrl by by appending given parameter keys and values
  const query = queryTypes.reduce(
    (queryStr, queryType, i) =>
      !!queryType ? `${queryStr}${queryType}=${queryValues[i]}&` : queryStr,
    ''
  );

  // Request and return response data 
  const fullUrl = `${PATIENT_URL}?${query}_format=json&_count=100`;
  const response = await axios.get(fullUrl);
  return response.data;
};

/**
 * Get a patient's basic data from their ID
 * @param {integer} id 
 * @returns response data
 */
export const getPatient = async (id) => {
  if (id === joeBlowId) return joeBlow; // Return a sample patient's data
  
  // Construct fullUrl by appending patient's ID
  const fullUrl = `${PATIENT_URL}/${id}`;
  
  // Request and return response data 
  const response = await axios.get(fullUrl);
  return response.data;
};
