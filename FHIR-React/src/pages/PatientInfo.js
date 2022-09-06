import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getPatient } from '../apis/patient';
import { AgGridReact } from 'ag-grid-react';
import AllergyIntolerance from '../components/AllergyIntolerance';
import MedicationStatement from '../components/MedicationStatement';
import ImmunizationRecommendation from '../components/ImmunizationRecommendation';

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css';
import '../stylesheets/PatientInfo.css'; // Place this import below ag-grid to overwrite it


/**
 * Extract the keys & values of an object and return it in a string in a tree-like structure. 
 * @param {Object} object
 * @param {string} indent
 * @returns content
 */
export const extractContent = (object, indent = '', content = '') => {
  if (object === undefined) return 'undefined'
  if (typeof object === 'object') {
    Object.entries(object).forEach(([key, value]) => {
      // To avoid printing numbers as keys when object is an Array
      if (!Array.isArray(object)) {
        content += indent + key + ':';
      }
      // If this is an object of length >=1 and its value is not string
      // (Basically it's not a single simple value), add a \n
      if (Object.keys(value).length >= 1 && typeof Object.entries(value)[0][1] !== 'string') {
        content += '\n';
      }
      content = extractContent(value, indent + ' ', content);
    });
  } else {
    // console.log(indent, object)
    content += ' ' + object + '\n';
  }

  // content.replace('\n', <br/>)
  // parser = new DOMParser(); 
  // xmlDoc = parser.parseFromString(content,"text/xml");
  // return xmlDoc;
  return content;
};


const convertData = (patientData) => {
  // See patient data structure here: https://www.hl7.org/fhir/patient.html#patient
  return [
    { dataType: 'identifier', value: extractContent(patientData.identifier) },
    { dataType: 'active', value: extractContent(patientData.active) },
    { dataType: 'name', value: extractContent(patientData.name) },
    { dataType: 'telecom', value: extractContent(patientData.telecom) },
    { dataType: 'gender', value: extractContent(patientData.gender) },
    { dataType: 'birthDate', value: extractContent(patientData.birthDate) },
    { dataType: 'deceased', value: extractContent(patientData.deceased) },
    { dataType: 'address', value: extractContent(patientData.address) },
    { dataType: 'maritalStatus', value: extractContent(patientData.maritalStatus) },
    { dataType: 'multipleBirth', value: extractContent(patientData.multipleBirth) },
    { dataType: 'photo', value: extractContent(patientData.photo) },
    { dataType: 'contact', value: extractContent(patientData.contact) },
    { dataType: 'communication', value: extractContent(patientData.communication) },
    { dataType: 'resourceType', value: extractContent(patientData.resourceType) },
    { dataType: 'meta', value: extractContent(patientData.meta) },
  ];
};

const PatientInfo = () => {
  const { id } = useParams();
  // ag-grid-table variables
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
      setRowData(data);
    });
  }, [id]);

  return (
    <div>
      <h3>Patient ID ⟨ {id} ⟩</h3>
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
      <AllergyIntolerance patientId={id} />
      <h4>Medication Statement</h4>
      <MedicationStatement patientId={id} />
      <h4>Immunization Recommendation</h4>
      <ImmunizationRecommendation patientId={id} />
    </div>
  );
};

export default PatientInfo;
