import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getPatient } from '../apis/patient';
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
  console.log(data)
  if (dataType === 'communication' && data !== undefined) {
    var communication = [];
    data.forEach(
      (element) => (communication = communication.concat([element.language.coding[0].display])));
    return JSON.stringify(communication)
  }
  if (data !== undefined) {
    return data
  }
  return 'n/a'
}

const convertData = (patientData) => {
  return [
    { dataType: 'name', dataValue: getValue(JSON.stringify(patientData.name)) },
    { dataType: 'resourceType', dataValue: getValue(patientData.resourceType) },
    { dataType: 'streetAddress', dataValue: getValue(JSON.stringify(patientData.address)) },
    { dataType: 'birthDate', dataValue:  getValue(patientData.birthDate) },
    { dataType: 'communication', dataValue: getValue(patientData.communication, 'communication') },
    { dataType: 'gender', dataValue: getValue(patientData.gender) },
    { dataType: 'identifier', dataValue: getValue(JSON.stringify(patientData.identifier)) },
    { dataType: 'lastUpdated', dataValue: getValue(patientData.meta.lastUpdated) },
    { dataType: 'security', dataValue: getValue(patientData.meta.security) },
    { dataType: 'versionId', dataValue: getValue(patientData.meta.versionId) },
    { dataType: 'telecom', dataValue: getValue(JSON.stringify(patientData.telecom)) },
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
      console.log(response);
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
    </div>
  );
};

export default PatientInfo;
