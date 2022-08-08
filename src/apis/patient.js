import axios from 'axios';

// Details about test servers here:
// https://www.notion.so/IPS-related-Servers-6acf8209fbfe484680c6a852b4292494
const BASE_URL = 'http://hapi.fhir.org/baseR4/';
const PATIENT_URL = `${BASE_URL}Patient`;

/**
 *  @description Search for patient by their ID number
 *  @param {integer} patientID
 *  @returns {xxx} xxx
 */
export const queryPatient = async (patientID) => await getPatient('', patientID);

/**
 *  @description Search for patient by Date of Birth
 *  @param {string} DoB
 *  Date of Birth in YYYY-MM-DD format
 *  E.G. 2001-02-08
 *  @returns {xxx} xxx
 */
export const searchPatientByDoB = async (DoB) => await getPatient('birthdate', DoB);

/**
 *  @description Search for patient by name. Note that `name` can either be in their first or last name.
 *  @param {string} name
 *  @returns {xxx} xxx
 */
export const searchPatientByName = async (name) => await getPatient('given', name);

/**
 *  @description Search for patient by last name.
 *  @param {string} name
 *  @returns {xxx} xxx
 */
export const searchPatientByFamilyName = async (familyName) =>
  await getPatient('family', familyName);

export const searchPatientByPhonetic = async (phonetic) => await getPatient('phonetic', phonetic);

/**
 *  @description Search for patient by name/last name/date of birth.
 *  Note that `name` can either be in their first or last name. Date of Birth is in YYYY-MM-DD format.
 *  @param {string} searchContent
 *  @param {string} searchCategory
 *  Must be 'name, 'lastname' or 'dob'
 *  @returns {xxx} xxx
 */
export const searchPatient = async (searchContent, searchCategory) => {
  if (searchCategory === 'name') {
    searchPatientByName(searchContent);
  } else if (searchCategory === 'lastname') {
    searchPatientByFamilyName(searchContent);
  } else if (searchCategory === 'dob') {
    searchPatientByDoB(searchContent);
  } else {
    throw new Error("searchCategory is not valid. Must be 'name, 'lastname' or 'dob'.");
  }
};

const getPatient = async (queryType, queryValue) => {
  const fullUrl = `${PATIENT_URL}?${queryType}=${queryValue}&_format=json`;
  const response = await axios.get(fullUrl);

  return response.data;
};
