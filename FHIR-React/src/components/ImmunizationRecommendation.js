import React, { useState, useEffect } from 'react';
import { getImmunizationRecommendation } from '../apis/immunizationRecommendation';
import { AgGridReact } from 'ag-grid-react';


// Testing patient ID: 2686624
const convertEntry = (entries) => {
  const rowData = entries.map((entry) => {
    const resource = entry.resource;
    return {
      id: resource.id,
      vaccine: resource.recommendation ? `${resource.recommendation[0].vaccineCode[0].coding[0].code} (${resource.recommendation[0].vaccineCode[0].coding[0].display})` : '',
      date: resource.date,
    }
  });
  return rowData;
};

export default function ImmunizationRecommendation({ patientId }) {
  const [total, setTotal] = useState('-');
  const [rowData, setRowData] = useState([]);

  // ag-grid-table variables
  const gridOptions = {
    defaultColDef: {
      filter: true,
      resizable: true,
      wrapText: true,
      autoHeight: true,
      autoWidth: true,
      editable: true,
    },
    columnDefs: [
      { headerName: 'ID', field: 'id', width: 110 },
      { headerName: 'Vaccine', field: 'vaccine' },
      { headerName: 'Date', field: 'date' },
    ],
    domLayout: 'autoHeight', 
    onGridReady: (params) => params.api.sizeColumnsToFit(),
  }

  // Get and update patient's ImmunizationRecommendation data
  useEffect(() => {
    getImmunizationRecommendation(patientId).then((response) => {
      console.log('ImmunizationRecommendation:', response);
      setTotal(response.total)
      if (response.total !== 0) {
        const data = convertEntry(response.entry);
        setRowData(data);
      }
    });
  }, [patientId]);

  return (
    <div>
      <p>Total: {total}</p>
      <div className="ag-theme-balham-dark" style={{width: '60vw'}}>
        <AgGridReact
          gridOptions={gridOptions}
          rowData={rowData}
        />
      </div>
    </div>
  );
}
