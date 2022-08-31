import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getPatient } from '../apis/patient';
import { AgGridReact } from 'ag-grid-react';
import AllergyIntolerance from '../components/AllergyIntolerance';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css';
import '../stylesheets/PatientInfo.css';

/**
 * Extract the keys & values of the object and return it in a string in a tree-like structure.
 * @param {Object} object
 * @param {string} indent
 * @returns content
 */
const extractContent = (object, indent = '', content = '') => {
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


/**
 * A function that checks the validity of the value before passing to Client side.
 * It also handles the data differently if `dataType` is given.
 * @param {*} data
 * @param {string} dataType
 * @returns value
 */
const getValue = (data, dataType = undefined) => {
  if (data !== undefined) {
    if (typeof data === 'object') {
      console.log(extractContent(data));
      return extractContent(data);
    }
    return data;
  }
  return 'n/a';
};

const convertData = (patientData) => {
  // See patient data structure here: https://www.hl7.org/fhir/patient.html#patient
  return [
    { dataType: 'identifier', value: getValue(patientData.identifier) },
    { dataType: 'active', value: getValue(patientData.active) },
    { dataType: 'name', value: getValue(patientData.name) },
    { dataType: 'telecom', value: getValue(patientData.telecom) },
    { dataType: 'gender', value: getValue(patientData.gender) },
    { dataType: 'birthDate', value: getValue(patientData.birthDate) },
    { dataType: 'deceased', value: getValue(patientData.deceased) },
    { dataType: 'address', value: getValue(patientData.address) },
    { dataType: 'maritalStatus', value: getValue(patientData.maritalStatus) },
    { dataType: 'multipleBirth', value: getValue(patientData.multipleBirth) },
    { dataType: 'photo', value: getValue(patientData.photo) },
    { dataType: 'contact', value: getValue(patientData.contact) },
    { dataType: 'communication', value: getValue(patientData.communication) },
    // { dataType: 'meta', value: getValue(JSON.stringify(patientData.meta)) }, // Do we need to display meta?
    { dataType: 'resourceType', value: getValue(patientData.resourceType) },
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
      <AllergyIntolerance patientID={id} />
    </div>
  );
};

export default PatientInfo;
