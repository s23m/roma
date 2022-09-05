import { AgGridReact } from 'ag-grid-react';
import { useState, useMemo, useEffect } from 'react';
import { getPatientProcedures } from '../apis/procedures';

const convertProcedureData = (data) =>
  !data.entry
    ? []
    : data.entry.map((procedure) => ({
        id: procedure.resource.id,
        name: procedure.resource.code.text,
      }));

const Procedures = ({ patientID, setCountCallback }) => {
  const [rowData, setRowData] = useState([]);
  const gridStyle = useMemo(() => ({ height: '30vh', width: '60vw' }), []);
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
    getPatientProcedures(patientID).then((response) => {
      console.log('Procedures response:', response);
      const data = convertProcedureData(response);
      setRowData(data);
      setCountCallback(data.length);
    });
  }, [patientID, setCountCallback]);

  return (
    <div>
      <div className="ag-theme-balham-dark" style={gridStyle}>
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
    </div>
  );
};

export default Procedures;
