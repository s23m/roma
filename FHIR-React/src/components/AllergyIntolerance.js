import React, { useState, useEffect, useMemo } from 'react';
import { getAllergyIntolerance } from '../apis/allergyIntolerance';
import { extractContent } from '../pages/PatientInfo';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css';


export const extractEntryArray = (entry) => {
  if (entry === undefined) return;
  if (entry !== undefined) {
    var entries = [];
    entry.forEach((element, index) => {
      const entryNumber = index + 1;
      entries.push({ dataType: 'Entry ' + entryNumber, value: extractContent(element) });
    });
    return entries;
  }
};

const convertData = (response) => {
  return [
    { dataType: 'ID', value: response.id },
    { dataType: 'Total entries', value: response.total },
    { dataType: 'Link', value: extractContent(response.link) },
    { dataType: 'Meta', value: extractContent(response.meta) },
    { dataType: 'Resource Type', value: extractContent(response.resourceType) },
    { dataType: 'Type', value: extractContent(response.type) },
  ].concat(extractEntryArray(response.entry));
};

export default function AllergyIntolerance({patientId}) {
  // ag-grid-table variables
  const [rowData, setRowData] = useState([]);
  const gridStyle = useMemo(() => ({ height: '50vh', width: '60vw' }), []);
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

  // Get and update patient's AllergyIntolerance data
  useEffect(() => {
    getAllergyIntolerance(patientId).then((response) => {
      console.log('AllergyIntolerance Response:', response);
      const data = convertData(response);
      setRowData(data);
    });
  }, [patientId]);
  
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
