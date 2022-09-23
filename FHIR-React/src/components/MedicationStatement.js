import React, { useState, useEffect } from 'react';
import { getMedicationStatement } from '../apis/medicationStatement';
import { Spinner } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';


/**
 * Extract the keys & values of an object and return it in a string in a tree-like structure. 
 * So far, with many branches/layers, it cannot display properly as space in string is altered in HTML element. 
 * @param {Object} object
 * @param {string} indent
 * @returns content
 */
const extractContent = (object, indent = '', content = '') => {
  if (object === undefined) return;
  if (typeof object === 'object') {
    Object.entries(object).forEach(([key, value]) => {
      // To avoid printing numbers as keys when object is an Array
      if (!Array.isArray(object)) {
        content += indent + key + ':';
      }
      // If this is an object of length >=1 and its value is not string
      // (Basically it's not a single simple value), add a \n
      if (Object.keys(value).length >= 1 && typeof Object.entries(value)[0][1] !== 'string') {
        content += '\n';
      }
      content = extractContent(value, indent + ' ', content);
    });
  } else {
    // console.log(indent, object)
    content += ' ' + object + '\n';
  }
  return content;
};

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
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    getMedicationStatement(patientId).then((response) => {
      console.log('MedicationStatement:', response);
      setTotal(response.total)
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
