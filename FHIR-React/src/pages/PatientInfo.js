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

const PatientInfo = () => {
  const { id } = useParams();
  const [patientData, setPatientData] = useState();

  // Render patient information
  useEffect(() => {
    getPatient(id)
      .then((response) => setPatientData(response.meta.versionId));
  });

  return (
    <div>
      <h3>Patient ID | {id} |</h3>
      <table className="PatientInfo-table">
        <tr>
          <th>Data type</th>
          <th>Data value</th>
        </tr>
        <tr>
          <td>Version ID</td>
          <td>{patientData}</td>
        </tr>
      </table>
    </div>
  );
};

export default PatientInfo;
