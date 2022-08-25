import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getPatient } from '../apis/patient';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css';
import '../stylesheets/PatientInfo.css';

const convertData = (patientData) => {

  var communication = [];
  patientData.communication
    .forEach(
      (element) => (communication = communication.concat([element.language.coding[0].display]))
    );

  const data = [
    { dataType: 'name', dataValue: JSON.stringify(patientData.name) || 'n/a'},
    { dataType: 'resourceType', dataValue: patientData.resourceType || 'n/a' },
    { dataType: 'streetAddress', dataValue: patientData.address[0].line.join(' ') || 'n/a' },
    { dataType: 'city', dataValue: patientData.address[0].city || 'n/a' },
    { dataType: 'postalCode', dataValue: patientData.address[0].postalCode || 'n/a' },
    { dataType: 'birthDate', dataValue: patientData.birthDate || 'n/a' },
    { dataType: 'communication', dataValue: communication || 'n/a' },
    { dataType: 'gender', dataValue: patientData.gender || 'n/a' },
    { dataType: 'identifier', dataValue: JSON.stringify(patientData.identifier) || 'n/a' },
    { dataType: 'lastUpdated', dataValue: patientData.meta.lastUpdated || 'n/a' },
    // { dataType: 'security', dataValue: patientData.meta.security[0].display || 'n/a' },
    { dataType: 'security', dataValue: patientData.meta.security[0].display || 'n/a' },
    { dataType: 'versionId', dataValue: patientData.meta.versionId || 'n/a' },
    { dataType: 'telecom', dataValue: JSON.stringify(patientData.telecom) || 'n/a' },
  ];
  return data;
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
