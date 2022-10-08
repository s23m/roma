import { useState, useEffect } from 'react';
import { getDiagnosticReport } from '../apis/diagnosticReport';
import { Spinner } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';


// Test patient ID: http://localhost:3000/patients/30358

const convertEntry = (entries) => {
  // Assistive function
  const getCategory = (resource) => {
    if (!resource.category) return 'N/A';
    return resource.category[0].coding[0].code
  }

  const rowData = entries.map( (entry) => {
    const resource = entry.resource;
    return {
      id: resource.id,
      status: resource.status,
      report: resource.code.coding[0].display || resource.code.coding[0].display || 'N/A',
      category: getCategory(resource),
      result: resource.result? resource.result[0].reference : 'N/A',
    }
  });
  return rowData;
};

export default function DiagnosticReport({ patientId }) {
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
      { headerName: 'Report', field: 'report', minWidth: 110 },
      { headerName: 'Category', field: 'category', minWidth: 110 },
      { headerName: 'Status', field: 'status', minWidth: 110 },
      { headerName: 'Result', field: 'result', minWidth: 110 },
    ],
    domLayout: 'autoHeight', 
    onGridReady: (params) => params.api.sizeColumnsToFit(),
  }

  // Get and update patient's ImmunizationRecommendation data
  useEffect(() => {
    setLoading(true);
    
    getDiagnosticReport(patientId)
      .then((response) => {
        console.log('Diagnostic Report response:', response);

        // set data for ag-grid
        if (response.total !== 0) {
            const data = convertEntry(response.entry)
            setRowData(data)
        }
        setLoading(false);
      })
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
