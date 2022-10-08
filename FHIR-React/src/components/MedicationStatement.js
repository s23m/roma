import { useState, useEffect } from 'react';
import { getMedicationStatement } from '../apis/medicationStatement';
import { Spinner } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';




// Testing patient link: http://localhost:3000/patients/6968973

/**
 * Get required data and convert data to fit AgGridReact input format
 * @param {*} entries 
 * @returns rowData for AgGridReact table
 */
const convertEntry = (entries) => {
  // Assistive function
  const getMedication = (medicationCodeableConcept) => {
    let medication = [];
    if (medicationCodeableConcept.text) 
      medication.push(medicationCodeableConcept.text);
    else if (medicationCodeableConcept.coding) 
      medication.push(medicationCodeableConcept.coding[0].display)
    return medication.join(', ')
  }
  
  // Assistive function
  const getDosage = (dosage) => {
    if (dosage)  return dosage[0].text || 'N/A';
    if (!dosage) return 'N/A';
  }

  const rowData = entries.map((entry) => {
    const resource = entry.resource;
    return {
      id: resource.id,
      medication: resource.medicationCodeableConcept ? getMedication(resource.medicationCodeableConcept) : 'N/A',
      dosage: getDosage(resource.dosage),
      reasonCode: resource.reasonCode ? resource.reasonCode[0].text : 'N/A',
    }
  });
  return rowData;
};



export default function MedicationStatement({ patientId }) {
  const [loading, setLoading] = useState(true);
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
      { headerName: 'ID', field: 'id', minWidth: 110 },
      { headerName: 'Medication', field: 'medication' },
      { headerName: 'Dosage', field: 'dosage' },
      { headerName: 'Reason', field: 'reasonCode' },
    ],
    domLayout: 'autoHeight', 
    onGridReady: (params) => params.api.sizeColumnsToFit(),
  }

  // Get and update patient's MedicationStatement data
  useEffect(() => {
    setLoading(true);
    getMedicationStatement(patientId).then((response) => {
      console.log('MedicationStatement:', response);
      if (response.total !== 0) {
        const data = convertEntry(response.entry);
        setRowData(data);
      }
      setLoading(false);
    });
  }, [patientId]);

  return loading ? (
    <Spinner />
  ) : (
    <div>
      <p>Total: {rowData.length}</p>
      {rowData.length > 0 ? (
        <div className="ag-theme-balham-dark" style={{width: '60vw'}}>
          <AgGridReact
            gridOptions={gridOptions}
            rowData={rowData}
          />
        </div>
      ) : (<br/>)}
    </div>
  );
}
