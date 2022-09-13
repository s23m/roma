import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getPatient } from '../apis/patient';
import { AgGridReact } from 'ag-grid-react';
import AllergyIntolerance from '../components/AllergyIntolerance';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css';
import '../stylesheets/PatientInfo.css';
import '../stylesheets/App.css';
import Procedures from '../components/Procedures';
import PatientInfoBasicCard from '../components/PatientInfoBasicCard';

/**
 * A function that checks the validity of the value before passing to Client side.
 * It also handles the data differently if `dataType` is given.
 * @param {*} data
 * @param {string} dataType
 * @returns value
 */
const getValue = (data, dataType = undefined) => {
  if (dataType === 'communication' && data !== undefined) {
    const validCommunications = data.filter((element) => !!element.language.coding);

    const communications = validCommunications.map((element) => element.language.coding[0].display);

    return JSON.stringify(communications);
  }
  if (data !== undefined) {
    if (typeof data === 'object') return JSON.stringify(data);
    return data;
  }
  return 'N/A';
};

const convertData = (patientData) => {
  // See patient data structure here: https://www.hl7.org/fhir/patient.html#patient
  return [
    {
      dataType: 'identifier',
      value: getValue(patientData.identifier),
    },
    { dataType: 'active', value: getValue(patientData.active) },
    { dataType: 'name', value: getValue(patientData.name) },
    { dataType: 'telecom', value: getValue(patientData.telecom) },
    { dataType: 'gender', value: getValue(patientData.gender) },
    {
      dataType: 'birthDate',
      value: getValue(patientData.birthDate),
    },
    { dataType: 'deceased', value: getValue(patientData.deceased) },
    { dataType: 'address', value: getValue(patientData.address) },
    {
      dataType: 'maritalStatus',
      value: getValue(patientData.maritalStatus),
    },
    {
      dataType: 'multipleBirth',
      value: getValue(patientData.multipleBirth),
    },
    { dataType: 'photo', value: getValue(patientData.photo) },
    { dataType: 'contact', value: getValue(patientData.contact) },
    {
      dataType: 'communication',
      value: getValue(patientData.communication, 'communication'),
    },
    {
      dataType: 'resourceType',
      value: getValue(patientData.resourceType),
    },
  ];
};

const PatientInfo = () => {
  const { id } = useParams();
  const [patientData, setPatientData] = useState({});
  // ag-grid-table variables
  const [procedureCount, setProcedureCount] = useState(0);
  const [rowData, setRowData] = useState([]);
  const gridStyle = useMemo(() => ({ height: '60vh', width: '60vw' }), []);
  const defaultColDef = {
    filter: true,
    resizable: true,
    wrapText: true,
    autoHeight: true,
    autoWidth: true,
    editable: true,
  };
  const columnDefs = [
    { headerName: 'Data type', field: 'dataType', maxWidth: 200 },
    { headerName: 'Value', field: 'value' },
  ];

  useEffect(() => {
    getPatient(id).then((response) => {
      console.log('Patient Response:', response);
      const data = convertData(response);
      setPatientData(response);
      setRowData(data);
    });
  }, [id]);

  const procedures = () => {
    const proceduresElement = Procedures({ patientID: id, setCountCallback: setProcedureCount });

    return procedureCount > 0 ? proceduresElement : <></>;
  };

  return (
    <div>
      <h3>Patient ID: {id}</h3>
      <PatientInfoBasicCard patientInfo={patientData} id={id}></PatientInfoBasicCard>
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

      <h4>Allergy Intolerance</h4>
      <AllergyIntolerance patientID={id} />

      <h4>Procedures</h4>
      <p>Count: {procedureCount}</p>
      {procedures()}
      {/* <Procedures patientID={id} setCountCallback={(count) => setProcedureCount(count)} /> */}
    </div>
  );
};

export default PatientInfo;
