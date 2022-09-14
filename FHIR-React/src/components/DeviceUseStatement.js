import React, { useState, useEffect } from 'react';
import { getDeviceNames } from '../apis/device';
import { getDeviceUseStatement } from '../apis/deviceUseStatement';
import { AgGridReact } from 'ag-grid-react';

// Test patient ID: http://localhost:3000/patients/2913418

const convertEntry = (entries, deviceNames) => {
  const rowData = entries.map( (entry, index) => {
    const resource = entry.resource;
    return {
      id: resource.device? resource.device.reference.split('/')[1] : '',
      name: deviceNames[index],
      derivedFrom: resource.derivedFrom? resource.derivedFrom[0].reference : '',
      source: resource.source? resource.source.reference : '',
    }
  });
  return rowData;
};

export default function DeviceUseStatement({ patientId }) {
  const [total, setTotal] = useState('-');
  const [rowData, setRowData] = useState();

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
      { headerName: 'Device ID', field: 'id', width: 110 },
      { headerName: 'Device name', field: 'name' },
      { headerName: 'Derived from', field: 'derivedFrom' },
      { headerName: 'Source', field: 'source' },
    ],
    domLayout: 'autoHeight', 
    onGridReady: (params) => params.api.sizeColumnsToFit(),
  }

  // Get and update patient's ImmunizationRecommendation data
  useEffect(() => {
    getDeviceUseStatement(patientId)
      .then((response) => {
        console.log('DeviceUseStatement:', response);
        setTotal(response.total)

        // set data for ag-grid
        if (response.total !== 0) {
          Promise.all(response.entry.map(getDeviceNames))
          .then( deviceNames => {
            const data = convertEntry(response.entry, deviceNames)
            setRowData(data)
          })
        }
      })
  }, [patientId]);

  return (
    <div>
      <p>Total: {total}</p>
      <div className="ag-theme-balham-dark" style={{width: '60vw'}}>
        <AgGridReact
          gridOptions={gridOptions}
          rowData={rowData}
        />
      </div>
    </div>
  );
}
