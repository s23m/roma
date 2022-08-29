import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getAllergyIntolerance } from '../apis/allergyIntolerance';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css';
import '../stylesheets/PatientInfo.css';


const convertData = (response) => {
  // See a data structure here: https://www.hl7.org/fhir/patient.html#patient
  return [
    { dataType: 'total', dataValue: response.total },
  ];  
};

export default function AllergyIntolerance({patientID}) {
  // ag-grid-table variables
  const [rowData, setRowData] = useState([]);
  const gridStyle = useMemo(() => ({ height: '20vh', width: '60vw' }), []);
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
    getAllergyIntolerance(patientID).then((response) => {
      console.log('AllergyIntolerance Response:', response);
      const data = convertData(response);
      setRowData(data);
    });
  }, [patientID]);
  
  return (
    <div>
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
  )
}
