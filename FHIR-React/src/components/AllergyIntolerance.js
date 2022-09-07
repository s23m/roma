import React, { useState, useEffect, useMemo } from 'react';
import { getAllergyIntolerance } from '../apis/allergyIntolerance';
import { extractContent } from '../pages/PatientInfo';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css';
import '../stylesheets/PatientInfo.css'; // Place this import below ag-grid to overwrite it (for styling customization purpose)


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

const convertData = (entries) => {
  const rowData = entries.map((entry) => {
    try {
      return {
        id: extractContent(entry.resource.id),
        code: extractContent(entry.resource.code.coding[0].code),
        display: extractContent(entry.resource.code.coding[0].display),
        category: extractContent(entry.resource.category),
        reaction: getReaction(entry.resource.reaction),
        recordedDate: extractContent(entry.resource.recordedDate),
      };
    } catch {
      return {
        givenNames: '<Incompatible Object>',
        familyName: '<Check console>',
        birthDate: '',
        gender: '',
        id: '',
      };
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
      const data = convertData(response.entry);
      console.log(data)
      setRowData(data);
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
