import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPatient } from '../apis/patient';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css';
import '../stylesheets/PatientInfo.css';
import '../stylesheets/App.css';
import PatientInfoBasicCard from '../components/PatientBasicInfoCard';
import PatientExtraInfoCard from '../components/PatientExtraInfoCard';

const PatientInfo = () => {
  const { id } = useParams();   // Get patient's ID from URL 
  const [patientData, setPatientData] = useState({});

  useEffect(() => {
    getPatient(id).then((response) => {
      console.log('Patient Response:', response);
      setPatientData(response);
    });
  }, [id]);

  return (
    <div>
      <PatientInfoBasicCard patientInfo={patientData} />
      <PatientExtraInfoCard patientInfo={patientData} id={id} />
    </div>
  );
};

export default PatientInfo;

