import { useState, useEffect } from 'react';
import { getImmunizationRecommendation } from '../apis/immunizationRecommendation';
import { Spinner } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';


// Testing patient ID: 2686624
const convertEntry = (entries) => {
  const rowData = entries.map((entry) => {
    const resource = entry.resource;
    return {
      id: resource.id,
      vaccine: resource.recommendation ? `${resource.recommendation[0].vaccineCode[0].coding[0].code} (${resource.recommendation[0].vaccineCode[0].coding[0].display})` : '',
      date: resource.date,
    }
  });
  return rowData;
};

export default function ImmunizationRecommendation({ patientId }) {
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
      { headerName: 'ID', field: 'id', width: 200},
      { headerName: 'Vaccine', field: 'vaccine', width: 400 },
      { headerName: 'Date', field: 'date', width: 400  },
    ],
    domLayout: 'autoHeight', 
    onGridReady: (params) => params.api.sizeColumnsToFit(),
  }

  // Get and update patient's ImmunizationRecommendation data
  useEffect(() => {
    setLoading(true);

    getImmunizationRecommendation(patientId).then((response) => {
      console.log('ImmunizationRecommendation:', response);
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
