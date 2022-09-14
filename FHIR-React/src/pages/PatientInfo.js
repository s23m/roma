import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPatient } from '../apis/patient';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css';
import '../stylesheets/PatientInfo.css';
import '../stylesheets/App.css';
import PatientInfoBasicCard from '../components/PatientInfoBasicCard';
import PatientExtraInfoCard from '../components/PatientExtraInfoCard';

const PatientInfo = () => {
  const { id } = useParams();
  const [patientData, setPatientData] = useState({});

  useEffect(() => {
    getPatient(id).then((response) => {
      console.log('Patient Response:', response);
      setPatientData(response);
    });
  }, [id]);

  return (
    <div>
      <h3>Patient ID: {id}</h3>
      <PatientInfoBasicCard patientInfo={patientData} />
      <PatientExtraInfoCard patientInfo={patientData} id={id} />
    </div>
  );
};

export default PatientInfo;
