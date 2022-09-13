import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { searchPatient } from '../apis/patient';
import { Spinner } from 'reactstrap';
import SearchBar from '../components/SearchBar';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css';
import '../stylesheets/Patient.css';
import '../stylesheets/App.css';

const baseURL = 'patients';
const convertData = (searchResults) => {
  const rowData = searchResults.map((patient) => {
    try {
      return {
        givenNames: patient.resource.name[0].given.join(' ') || 'n/a',
        familyName: patient.resource.name[0].family || 'n/a',
        birthDate: patient.resource.birthDate || 'n/a',
        gender: patient.resource.gender || 'n/a',
        id: patient.resource.id || 'n/a',
      };
    } catch {
      return {
        givenNames: '<Incompatible Object>',
        familyName: '<Check console>',
        birthDate: '',
        gender: '',
        id: '',
      };
    }
  });
  return rowData;
};

const createHyperlinkToPatientPage = (params) => {
  return (
    <a href={`${baseURL}/${params.value}`} rel="noreferrer" target="_blank">
      {' '}
      {params.value}{' '}
    </a>
  );
};

// All params existed in https://hapi.fhir.org/baseR4/swagger-ui/?page=Patient
const searchTypes = [
  'name',
  'family',
  'birthdate',
  'phone',
  'gender',
  'family',
  'deceased',
  'address-state',
  '_lastUpdated',
  'link',
  'language',
  'add-country',
  'death-date',
  'phonetic',
  'telecom',
  'address-city',
  'email',
  'given',
  'identifier',
  'address',
  'general-practitioner',
  '_security',
  'active',
  'address-postcode',
  '_filter',
  'profile',
  '_tag',
  'organization',
  '_has',
  'address-use',
  '_source',
  '_id',
  '_text',
  '_content',
];

const Patients = () => {
  // ag-grid-table variables
  const gridStyle = useMemo(() => ({ height: '70vh', width: '100%' }), []);
  const defaultColDef = {
    filter: true,
    sortable: true,
    resizable: true,
  };
  const columnDefs = [
    { headerName: 'Given names', field: 'givenNames' },
    { headerName: 'Family name', field: 'familyName' },
    { headerName: 'Birthdate', field: 'birthDate' },
    { headerName: 'Gender', field: 'gender' },
    {
      headerName: 'ID',
      field: 'id',
      cellRenderer: (params) => createHyperlinkToPatientPage(params),
    },
  ];
  const [rowData, setRowData] = useState([
    {
      givenNames: 'Adam',
      familyName: 'ThisisAnExample',
      birthDate: '1970-05-06',
      gender: 'male',
      id: 123126969,
    },
    { givenNames: 'Joe', familyName: 'Blow', birthDate: '1979-09-06', gender: 'male', id: 1777777 },
  ]);
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(false);

  const onSearchSubmit = async (queryType, queryValue) => {
    setLoading(true);
    const searchResults = await searchPatient(queryType, queryValue); // Get data
    setLoading(false);
    console.log(searchResults); // For debugging

    if (searchResults.total !== 0) {
      const rowData = convertData(searchResults.entry);
      setRowData(rowData);
      setNotification(`Total entries found: ${searchResults.total || searchResults.entry.length}`);
    } else {
      setNotification('Total entries found: 0');
    }
  };

  const searchBar = SearchBar({
    placeholder: 'Enter search query',
    onSubmit: onSearchSubmit,
    options: searchTypes,
  });

  return (
    <div>
      <h3>Search for patient records</h3>
      {loading ? <Spinner /> : searchBar}

      <p>{notification}</p>

      <div className="ag-theme-balham-dark" style={gridStyle}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          pagination={true}
          paginationPageSize={50}
          defaultColDef={defaultColDef}
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
          }}
        />
      </div>
    </div>
  );
};

export default Patients;
