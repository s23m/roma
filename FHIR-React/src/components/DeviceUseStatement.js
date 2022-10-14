import { useState, useEffect } from 'react';
import { getDeviceNames } from '../apis/device';
import { getDeviceUseStatement } from '../apis/deviceUseStatement';
import { Spinner } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';

// Testing patient link
// http://localhost:3000/patients/2913418

/**
 * Get required data and convert it to fit AgGridReact input format
 * @param {*} entries 
 * @param {*} deviceNames An array of device names
 * @returns rowData for AgGridReact table
 */

const convertEntry = (entries, deviceNames) => {
  const rowData = entries.map( (entry, index) => {
    const resource = entry.resource;
    return {
      id: resource.device? resource.device.reference.split('/')[1] : 'N/A',
      name: deviceNames[index],
      derivedFrom: resource.derivedFrom? resource.derivedFrom[0].reference : 'N/A',
      source: resource.source? resource.source.reference : 'N/A',
    }
  });
  return rowData;
};

export default function DeviceUseStatement({ patientId }) {
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
      { headerName: 'Device ID', field: 'id', width: 120 },
      { headerName: 'Device name', field: 'name', width: 120, flex: 1 },
      { headerName: 'Derived from', field: 'derivedFrom', width: 160, flex: 1 },
      { headerName: 'Source', field: 'source', width: 160 },
    ],
    domLayout: 'autoHeight', 
    onGridReady: (params) => params.api.sizeColumnsToFit(),
  }

  // Get and update patient's ImmunizationRecommendation data
  useEffect(() => {
    setLoading(true);
    
    getDeviceUseStatement(patientId)
      .then((response) => {
        console.log('DeviceUseStatement:', response);

        // set data for ag-grid
        if (response.total !== 0) {
          // Using Promise.all function to get full "responded" array of device names
          Promise.all(response.entry.map(getDeviceNames))
          .then( deviceNames => {
            // console.log('Device names:', deviceNames)
            const data = convertEntry(response.entry, deviceNames)
            setRowData(data)
          })
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
