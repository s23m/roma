import React, { useState, useEffect } from 'react';
import { getAllergyIntolerance } from '../apis/allergyIntolerance';
import { extractContent } from '../pages/PatientInfo';

import { AgGridReact } from 'ag-grid-react';


// Test Patient ID: 1059, 6968973
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


const convertEntry = (entries) => {
  const getReaction = (reaction) => {
    const reactionString = [];
    if (reaction[0].manifestation === undefined) return 'undefined';
    if (reaction[0].manifestation !== undefined) {
      reaction[0].manifestation.forEach((element) => {
        reactionString.push(element.coding[0].display);
      })
      return reactionString;
    }
  }

  const rowData = entries.map((entry) => {
    const resource = entry.resource;
    return {
      id: resource.id,
      code: resource.code ? resource.code.coding[0].code : '',
      display: resource.code ? resource.code.coding[0].display : '',
      category: resource.category,
      reaction: resource.reaction ? getReaction(resource.reaction) : '',
      criticality: resource.criticality,
      recordedDate: resource.recordedDate,
    }
  });
  return rowData;
};

export default function AllergyIntolerance({patientId}) {
  const [total, setTotal] = useState('-');
  const [rowData, setRowData] = useState([]);
  
  // ag-grid-table variables
  const gridOptions = {
    columnDefs: [
      { headerName: 'ID', field: 'id', width: 110},
      { headerName: 'Code', field: 'code', width: 140 },
      { headerName: 'Display', field: 'display' },
      { headerName: 'Category', field: 'category' },
      { headerName: 'Reaction', field: 'reaction' },
      { headerName: 'Criticality', field: 'criticality', width: 90 },      
      { headerName: 'Recorded date', field: 'recordedDate', width: 140  },
    ],
    defaultColDef: { 
      filter: true, 
      resizable: true,
      wrapText: true,
      autoHeight: true,
      autoWidth: true,
      editable: true,
    }, 
    domLayout: 'autoHeight', 
    onGridReady: (params) => params.api.sizeColumnsToFit(),
  }

  // Get and update patient's AllergyIntolerance data
  useEffect(() => {
    getAllergyIntolerance(patientId).then((response) => {
      console.log('AllergyIntolerance Response:', response);
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
      <div className="ag-theme-balham-dark" style={{ width:'60vw' }}>
        <AgGridReact
          gridOptions={gridOptions}
          rowData={rowData}
        />
      </div>
    </div>
  )
}
