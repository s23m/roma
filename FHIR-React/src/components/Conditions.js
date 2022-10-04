import { useState, useEffect } from 'react';
import { Spinner } from 'reactstrap';
import { getCondition } from '../apis/condition';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css';
import '../stylesheets/PatientInfo.css';



// http://localhost:3000/patients/gtp101

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
      code: resource.code ? resource.code.coding[0].code : 'N/A',
      display: resource.code ? resource.code.coding[0].display : 'N/A',
      clinicalStatus: resource.clinicalStatus? resource.clinicalStatus.coding[0].code || resource.clinicalStatus.coding[0].display : 'N/A',
      onsetAge: resource.onsetAge ? resource.onsetAge.value : 'N/A',
      onsetDateTime: resource.onsetDateTime || 'N/A',
    }
  });
  return rowData;
};


export default function Condition({ patientId }) {
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  
  // ag-grid-table variables
  const gridOptions = {
    columnDefs: [
      { headerName: 'ID', field: 'id', width: 100 },
      { headerName: 'Code', field: 'code', width: 110 },
      { headerName: 'Display', field: 'display', width: 300 },
      { headerName: 'Clinical status', field: 'clinicalStatus', width: 100 },
      { headerName: 'OnsetAge', field: 'onsetAge', width: 100 },
      { headerName: 'OnsetDateTime', field: 'onsetDateTime', width: 140 },
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

    getCondition(patientId).then((response) => {
      console.log('Condition Response:', response);
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

