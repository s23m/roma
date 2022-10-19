import axios from 'axios';
import BASE_URL from './baseUrl';
import { joeBlow, joeBlowId } from '../mock-data/patients';

// Add targeted endpoint
const PATIENT_URL = `${BASE_URL}Patient`;

/**
 * Get patient search results from a set of parameter values
 * Each element in queryTypes should have a matching value in queryValues
 * Matching types and values should be at the same index
 * @param {Array<String>} queryTypes
 * @param {Array<String>} queryValues
 * @returns response data
 */
export const searchPatient = async (queryTypes, queryValues) => {
  if (queryTypes.length !== queryValues.length)
    throw new Error('Invalid query. Unequal number of query types and query values.');

  // Construct query portion of request URL
  // by appending each provided parameter key and value
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
  if (id === joeBlowId) return joeBlow; // Return mock patient's data

  // Construct fullUrl by appending patient's ID
  const fullUrl = `${PATIENT_URL}/${id}`;

  // Request and return response data
  const response = await axios.get(fullUrl);
  return response.data;
};
