import React, { useState, useEffect } from "react"
import axios from "axios"

// Details about test servers here: 
// https://www.notion.so/IPS-related-Servers-6acf8209fbfe484680c6a852b4292494
const BASE_URL = 'http://nprogram.azurewebsites.net/'
const PATIENT_URL = `${BASE_URL}Patient/`




/**
 *  @description Search for patient by their ID number
 *  @param {integer} patientID 
 *  @returns {xxx} xxx
 */
const queryPatient = async (patientID, format='json') => {
    const fullUrl = `${PATIENT_URL}${patientID}?_format=${format}`
    const response = await axios.get(fullUrl)

    return response
    // setPatientInfo(response.data.text.div)
}

/**
 *  @description Search for patient by Date of Birth
 *  @param {string} DoB 
 *  Date of Birth in YYYY-MM-DD format   
 *  E.G. 2001-02-08
 *  @returns {xxx} xxx
 */
const searchPatientByDoB = async (DoB) => {
    const fullUrl = `${PATIENT_URL}search?birthDate=${DoB}&_format=json`
    const response = await axios.get(fullUrl)
}

/**
 *  @description Search for patient by name. Note that `name` can either be in their first or last name.
 *  @param {string} name 
 *  @returns {xxx} xxx
 */
const searchPatientByName = async (name) => {
    const fullUrl = `${PATIENT_URL}search?name=${name}&_format=json`
    const response = await axios.get(fullUrl)

    
    console.log(response.data)
}


/**
 *  @description Search for patient by last name.
 *  @param {string} name 
 *  @returns {xxx} xxx
 */
const searchPatientByLastName = async (lastName) => {
    const fullUrl = `${PATIENT_URL}search?family=${lastName}&_format=json`
    const response = await axios.get(fullUrl)
}




/**
 *  @description Search for patient by name/last name/date of birth. 
 *  Note that `name` can either be in their first or last name. Date of Birth is in YYYY-MM-DD format.
 *  @param {string} searchContent 
 *  @param {string} searchCategory
 *  Must be 'name, 'lastname' or 'dob'
 *  @returns {xxx} xxx
 */
const searchPatient = async(searchContent, searchCategory) => {
    if (searchCategory === 'name') {
        searchPatientByName(searchContent)
    } else if (searchCategory === 'lastname') {
        searchPatientByLastName(searchContent)
    } else if (searchCategory === 'dob') {
        searchPatientByDoB(searchContent)
    } else {
        throw new Error("searchCategory is not valid. Must be 'name, 'lastname' or 'dob'.")
    }
}



// queryPatient(1)
// queryPatient(2)
// queryPatient(3)
// queryPatient(10)
// queryPatient(100)
// searchPatientByName('Bradley')

export default function Patient() {
    const [patientInfo, setPatientInfo] = useState()

    useEffect(() => {
        queryPatient(1)
        .then((response) => setPatientInfo(response.data.name[0].given + ' ' + response.data.name[0].family))
    })

    return(
        <div>
            <p>Patient info is displayed here. </p>
            {patientInfo}
        </div>


        // {countries.map((country) => (
        //     <option key={country}>{country}</option> ))}
    )
}
