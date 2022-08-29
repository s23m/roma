import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getPatient } from '../apis/patient';
import AllergyIntolerance from '../components/AllergyIntolerance';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css';
import '../stylesheets/PatientInfo.css';

/**
 * A function that checks the validity of the value before passing to Client side. 
 * It also handles the data differently if `dataType` is given. 
 * @param {*} data 
 * @param {string} dataType 
 * @returns dataValue
 */ 
const getValue = (data, dataType=undefined) => {
  if (dataType === 'communication' && data !== undefined) {
    var communication = [];
    data.forEach(
      (element) => (communication = communication.concat([element.language.coding[0].display])));
    return JSON.stringify(communication)
  }
  if (data !== undefined) {
    if (typeof data === 'object') return JSON.stringify(data)
    return data
  }
  return 'n/a'
}

const convertData = (patientData) => {
  // See patient data structure here: https://www.hl7.org/fhir/patient.html#patient
  return [
    { dataType: 'identifier', dataValue: getValue(patientData.identifier) },
    { dataType: 'active', dataValue: getValue(patientData.active) },
    { dataType: 'name', dataValue: getValue(patientData.name) },
    { dataType: 'telecom', dataValue: getValue(patientData.telecom) },
    { dataType: 'gender', dataValue: getValue(patientData.gender) },
    { dataType: 'birthDate', dataValue:  getValue(patientData.birthDate) },
    { dataType: 'deceased', dataValue:  getValue(patientData.deceased) },
    { dataType: 'address', dataValue: getValue(patientData.address) },
    { dataType: 'maritalStatus', dataValue:  getValue(patientData.maritalStatus) },
    { dataType: 'multipleBirth', dataValue:  getValue(patientData.multipleBirth) },
    { dataType: 'photo', dataValue:  getValue(patientData.photo) },
    { dataType: 'contact', dataValue:  getValue(patientData.contact) },
    { dataType: 'communication', dataValue: getValue(patientData.communication, 'communication') },
    // { dataType: 'meta', dataValue: getValue(JSON.stringify(patientData.meta)) }, // Do we need to display meta?
    { dataType: 'resourceType', dataValue: getValue(patientData.resourceType) },
  ];  
};

const PatientInfo = () => {
  const { id } = useParams();
  // ag-grid-table variables
  const [rowData, setRowData] = useState([]);
  const gridStyle = useMemo(() => ({ height: '70vh', width: '60vw' }), []);
  const defaultColDef = { 
    filter: true, 
    resizable: true,
    wrapText: true, 
    autoHeight: true,
    autoWidth: true,
    editable: true,
  };
  const columnDefs = [
    { headerName: 'Data type', field: 'dataType', maxWidth: 200},
    { headerName: 'Data value', field: 'dataValue' },
  ];


  useEffect(() => {
    getPatient(id).then((response) => {
      console.log('Patient Response:', response);
      const data = convertData(response);
      setRowData(data);
    });
  }, [id]);


  return (
    <div>
      <h3>Patient ID ⟨ {id} ⟩</h3>
      <div className="ag-theme-balham-dark" style={gridStyle}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
            params.columnApi.autoSizeColumns();
          }}
        />
      </div>

      <h4>Allergy Intolerance</h4>
      <AllergyIntolerance patientID={123}/>
    </div>
  );
};

export default PatientInfo;
