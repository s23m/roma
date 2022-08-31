import React, { useState, useEffect, useMemo } from 'react';
import { getMedicationStatement } from '../apis/medicationStatement';
import { extractContent } from '../pages/PatientInfo';
import { extractEntryArray } from './AllergyIntolerance';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css';
import '../stylesheets/MedicalStatement.css';




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

// patient ID to test: 6968973
export default function MedicationStatement({ patientId }) {
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
    { headerName: 'Data type', field: 'dataType', maxWidth: 200 },
    { headerName: 'Value', field: 'value' },
  ];

  useEffect(() => {
    // ------------------------------------
    getMedicationStatement(patientId).then((response) => {
      console.log('MedicationStatement:', response);
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
  );
}
