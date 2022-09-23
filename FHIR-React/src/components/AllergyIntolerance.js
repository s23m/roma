import React, { useState, useEffect } from 'react';
import { Spinner } from 'reactstrap';
import { getAllergyIntolerance } from '../apis/allergyIntolerance';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css';
import '../stylesheets/PatientInfo.css';

// const convertEntry = (response) => {
//   if (response.entry === undefined) return [];

//   const entries = response.entry.map((entry, i) => ({
//     dataType: 'Entry ' + i,
//     value: getValue(entry.resource.code.text),
//   }));

//   // var entries = [];
//   // entry.forEach((element, index) => {
//   //   entries.push({ dataType: 'Entry ' + index, value: getValue(element.resource.code.text) });
//   // });
//   return entries;
// };

// const convertData = (response) => {
//   return [{ dataType: 'Total entries', value: response.total }].concat(
//     convertEntry(response.entry)
//   );
// };

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


export default function AllergyIntolerance({ patientId }) {
  const [loading, setLoading] = useState(true);
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
      { headerName: 'Recorded date', field: 'recordedDate'  },
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

  useEffect(() => {
    setLoading(true);

    getAllergyIntolerance(patientId).then((response) => {
      console.log('AllergyIntolerance Response:', response);
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
      <p>Count: {rowData.length}</p>
      {rowData.length > 0 ? (
        <div className="ag-theme-balham-dark" style={{ width:'60vw' }}>
          <AgGridReact
            gridOptions={gridOptions}
            rowData={rowData}
          />
        </div>
      ) : (
        <br/>
      )}
    </div>
  );
}

