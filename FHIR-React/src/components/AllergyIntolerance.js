import React, { useState, useEffect, useMemo } from 'react';
import { getAllergyIntolerance } from '../apis/allergyIntolerance';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css';
import '../stylesheets/PatientInfo.css';


const getValue = (data, dataType=undefined) => {
  if (data !== undefined) {
    if (typeof data === 'object') return JSON.stringify(data)
    return data
  }
  return 'Description is not available'
}

const convertEntry = (entry) => {
  if (entry === undefined) return;
  
  var entries = [];
  entry.forEach((element, index) => {
    entries.push({dataType: 'Entry '+index, value: getValue(element.resource.code.text)})
  })
  return entries;
}

const convertData = (response) => {
  return [
    { dataType: 'Total entries', value: response.total },
  ].concat(convertEntry(response.entry));  
};

export default function AllergyIntolerance({patientID}) {
  // ag-grid-table variables
  const [rowData, setRowData] = useState([]);
  const gridStyle = useMemo(() => ({ height: '30vh', width: '60vw' }), []);
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
    { headerName: 'Value', field: 'value' },
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
