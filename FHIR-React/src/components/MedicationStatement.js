import { useState, useEffect } from 'react';
import { getMedicationStatement } from '../apis/medicationStatement';
import { Spinner } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';




// Testing patient link: 
// http://localhost:3000/patients/6968973

/**
 * Get required data and convert it to fit AgGridReact input format
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
  
  const getDosage = (dosage) => {
    if (dosage)  return dosage[0].text || 'N/A';
    if (!dosage) return 'N/A';
  }

  // Convert
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

  // AgGridReact variables
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
      { headerName: 'ID', field: 'id', width: 110, flex: 0.8 },
      { headerName: 'Medication', field: 'medication', width: 200, flex: 1.7 },
      { headerName: 'Dosage', field: 'dosage', width: 200, flex: 1.7 },
      { headerName: 'Reason', field: 'reasonCode', width: 100, flex: 1 },
    ],
    domLayout: 'autoHeight', 
    onGridReady: (params) => params.api.sizeColumnsToFit(),
  }

  // Get and update patient's MedicationStatement data
  useEffect(() => {
    setLoading(true);
    getMedicationStatement(patientId).then((response) => {
      console.log('MedicationStatement:', response); // for debugging
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
