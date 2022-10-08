import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { searchPatient } from '../apis/patient';
import { Spinner } from 'reactstrap';
import SearchBar from '../components/SearchBar';
import { joeBlow } from '../mock-data/patients';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css';
import '../stylesheets/Patient.css';
import '../stylesheets/App.css';

const NA = 'N/A'


/**
 * Get required data from `searchResults` and convert it to fit AgGridReact input format
 * @param {*} searchResults 
 * @returns rowData for AgGridReact table
 */
const convertData = (searchResults) => {
  const rowData = searchResults.map((patient) => {
    try {
      return {
        givenNames: patient.resource.name[0].given.join(' ') || NA,
        familyName: patient.resource.name[0].family || NA,
        birthDate: patient.resource.birthDate || NA,
        gender: patient.resource.gender || NA,
        id: patient.resource.id || NA,
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
    <a href={`patients/${params.value}`} rel="noreferrer" target="_blank">
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
      { headerName: 'Given names', field: 'givenNames' },
      { headerName: 'Family name', field: 'familyName' },
      { headerName: 'Birthdate', field: 'birthDate' },
      { headerName: 'Gender', field: 'gender' },
      {
        headerName: 'ID',
        field: 'id',
        cellRenderer: (params) => createHyperlinkToPatientPage(params),
      },
    ],
    domLayout: 'autoHeight', 
    onGridReady: (params) => params.api.sizeColumnsToFit(),
  }

  const joeBlowData = convertData([{ resource: joeBlow }]);
  const [rowData, setRowData] = useState([
    {
      givenNames: 'Adam',
      familyName: 'ThisisAnExample',
      birthDate: '1970-05-06',
      gender: 'male',
      id: 123126969,
    },
    ...joeBlowData,
  ]);
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(false);

  const onSearchSubmit = async (queryType, queryValue) => {
    setLoading(true);
    const searchResult = await searchPatient(queryType, queryValue); // Get data
    setLoading(false);
    console.log('Patient Search Result:', searchResult); // For debugging

    if (searchResult.total !== 0) {
      const rowData = convertData(searchResult.entry);
      setRowData(rowData);
      setNotification(`Total entries found: ${searchResult.total || searchResult.entry.length}`);
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

      <div className="ag-theme-balham-dark" style={{width: '60vw'}}>
        <AgGridReact
            gridOptions={gridOptions}
            rowData={rowData}
        />
      </div>
    </div>
  );
};

export default Patients;
