import { AgGridReact } from 'ag-grid-react';
import { useState, useEffect } from 'react';
import { Spinner } from 'reactstrap';
import { getPatientProcedures } from '../apis/procedures';

const convertProcedureData = (data) =>
  !data.entry
    ? []
    : data.entry.map((procedure) => ({
        id: procedure.resource.id,
        name: procedure.resource.code.text,
      }));

const Procedures = ({ patientId }) => {
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const defaultColDef = {
    filter: true,
    resizable: true,
    wrapText: true,
    autoHeight: true,
    autoWidth: true,
    editable: true,
  };
  const columnDefs = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Name', field: 'name' },
  ];

  useEffect(() => {
    setLoading(true);

    getPatientProcedures(patientId).then((response) => {
      console.log('Procedures response:', response);
      const data = convertProcedureData(response);
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
            columnDefs={columnDefs}
            rowData={rowData}
            defaultColDef={defaultColDef}
            onGridReady={(params) => {
              params.api.sizeColumnsToFit();
              params.columnApi.autoSizeColumns();
            }}
          />
        </div>
      ) : (
        <br/>
      )}
    </div>
  );
};

export default Procedures;
