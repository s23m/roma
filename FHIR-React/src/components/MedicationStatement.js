import React, { useState, useEffect } from 'react';
import { getMedicationStatement } from '../apis/medicationStatement';
import { extractContent } from '../pages/PatientInfo';

import { AgGridReact } from 'ag-grid-react';


// patient ID to test: 6968973
const convertEntry = (entries) => {
  const rowData = entries.map((entry) => {
    const resource = entry.resource;
    return {
      id: resource.id,
      medicationCodeableConcept: resource.medicationCodeableConcept ? extractContent(resource.medicationCodeableConcept.text) : '',
      dosage: resource.dosage ? resource.dosage[0].text : '',
      reasonCode: resource.reasonCode ? resource.reasonCode[0].text : '',
    }
  });
  return rowData;
};

export default function MedicationStatement({ patientId }) {
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
      { headerName: 'Medication', field: 'medicationCodeableConcept' },
      { headerName: 'Dosage', field: 'dosage' },
      { headerName: 'Reason', field: 'reasonCode' },
    ],
    domLayout: 'autoHeight', 
    onGridReady: (params) => params.api.sizeColumnsToFit(),
  }

  // Get and update patient's MedicationStatement data
  useEffect(() => {
    getMedicationStatement(patientId).then((response) => {
      console.log('MedicationStatement:', response);
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
