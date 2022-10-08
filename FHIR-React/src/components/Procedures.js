import { AgGridReact } from 'ag-grid-react';
import { useState, useEffect } from 'react';
import { Spinner } from 'reactstrap';
import { getPatientProcedures } from '../apis/procedures';


const convertProcedureData = (entries) => {
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
        { headerName: 'ID', field: 'id' },
        { headerName: 'Name', field: 'name' },
      ],
      domLayout: 'autoHeight', 
      onGridReady: (params) => params.api.sizeColumnsToFit(),
    }

  useEffect(() => {
    setLoading(true);

    getPatientProcedures(patientId).then((response) => {
      console.log('Procedures response:', response);
      const data = convertProcedureData(response.entry);
      setRowData(data);
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
