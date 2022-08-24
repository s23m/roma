import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPatient } from '../apis/patient';

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css';
import '../stylesheets/PatientInfo.css';

// const convertPatientDataToHtml = (patientData) => {
//   console.log(patientData);
//   if (patientData.meta.versionId) {
//     return patientData.meta.versionId;
//   }
// };
const convertData = (patientData) => {
  
  // This communication part is clunky, to be improved
  var communication = patientData.communication[0].language.coding[0].display
  patientData.communication.slice(1).forEach(element => 
    communication = communication + ', ' + element.language.coding[0].display)

  const data = {
    streetAddress: patientData.address[0].line.join(' '),
    city: patientData.address[0].city,
    postalCode: patientData.address[0].postalCode,
    birthDate: patientData.birthDate,
    communication: communication,
  }
  return data
}


const PatientInfo = () => {
  const { id } = useParams()
  const [patientData, setPatientData] = useState()

  useEffect(() => {
    getPatient(id)
      .then((response) => {
        console.log('1', response)
        return convertData(response)})
      .then(response => {
        console.log('2', response)
        setPatientData(response)})
  }, [id]);

  return (
    <div>
      <h3>Patient ID | {id} |</h3>
      <table className="PatientInfo-table">
        <tr>
          <th>Data type</th>
          <th>Data value</th>
        </tr>
        {Object.keys(patientData).map(key => (
            <tr>
              <td>{key}</td>
              <td>{patientData[key]}</td>
            </tr>
        ))}
      </table>
    </div>
  );
};

export default PatientInfo;
