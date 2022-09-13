import React, { useState, useEffect } from 'react';
import { getDevice, getDeviceName } from '../apis/device';
import { getDeviceUseStatement } from '../apis/deviceUseStatement';
import { AgGridReact } from 'ag-grid-react';

// Test patient ID: 2913418
const convertEntry = (entries) => {
  
  const rowData = entries.map((entry) => {
    const resource = entry.resource;
    // const deviceName = '';
    // getDevice(resource.id).then(response => {
    //   deviceName = response.deviceName[0].name;
    // });
    return {
      id: resource.device? resource.device.reference.split('/')[1] : '',
      name: getDeviceName(resource.device.reference).then(value => {
        console.log('value', value);
      }),
      derivedFrom: resource.derivedFrom? resource.derivedFrom[0].reference : '',
      source: resource.source? resource.source.reference : '',
    }
  });
  return rowData;
};

export default function DeviceUseStatement({ patientId }) {
  const [total, setTotal] = useState('-');
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
    getDeviceUseStatement(patientId).then((response) => {
      console.log('DeviceUseStatement:', response);
      setTotal(response.total)
      if (response.total !== 0) {
        const data = convertEntry(response.entry);
        setRowData(data);
      }
    });
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
