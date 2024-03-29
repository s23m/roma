import { AgGridReact } from 'ag-grid-react';
import { useState, useEffect } from 'react';
import { Spinner } from 'reactstrap';
import { getPatientProcedures } from '../apis/procedures';

// Testing patient link
// http://localhost:3000/patients/example

/**
 * Get required data and convert it to fit AgGridReact input format
 * @param {*} entries 
 * @returns rowData for AgGridReact table
 */
const convertEntry = (entries) => {
  // Assistive function
  const getProcedureText = (resource) => {
    if (!resource.code) return 'N/A';
    return resource.code.text || resource.code.coding[0].display || 'N/A'
  }

  const rowData = entries.map((entry) => {
      const resource = entry.resource;
      return {
        id: resource.id,
        name: getProcedureText(resource),
      }
    });
  return rowData;
}

const Procedures = ({ patientId }) => {
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
        { headerName: 'ID', field: 'id', width: 200 },
        { headerName: 'Name', field: 'name', width: 300 },
      ],
      domLayout: 'autoHeight', 
      onGridReady: (params) => params.api.sizeColumnsToFit(),
    }

  useEffect(() => {
    setLoading(true);

    getPatientProcedures(patientId).then((response) => {
      console.log('Procedures response:', response); // for debugging
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
        <div className="ag-theme-balham-dark" style={{width: '60vw'}}>
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
};

export default Procedures;
