import React, { useState } from 'react';
import { AgGridReact } from "ag-grid-react";
import { getPatient } from '../apis/patient';
import SearchBar from '../components/SearchBar';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css';
import '../stylesheets/Patient.css';


const convertSearchResultToRowData = (searchResults) => {
  const rowData = searchResults.map((patient) => {
    return {
      givenNames: patient.resource.name[0].given.join(' '),
      familyName: patient.resource.name[0].family,
      birthDate:  patient.resource.birthDate,
      gender: patient.resource.gender,
      id: patient.resource.id
    }
  })
  return rowData;
};

// More to be added from available params of http://hapi.fhir.org/baseR4/
const searchTypes = [
  'name', 'family', 'birthdate', 'phone', 'gender', 'family', 
  'deceased', 'address-state', '_lastUpdated', 'link',
  'language', 'add-country', 'death-date', 'phonetic',
  'telecom', 'address-city', 'email', 'given', 'identifier',
  'address', 'general-practitioner', '_security', 'active',
  'address-postcode', '_filter', 'profile', '_tag', 'organization',
  '_has', 'address-use', '_source', '_id', '_text', '_content', 
] 

const Patient = () => {
  // ag-grid-table variables
  const columnDefs = [
    { headerName: "Given names", field: "givenNames", sortable: true, filter: true, resizable: true},
    { headerName: "Family name", field: "familyName", sortable: true, filter: true, resizable: true},
    { headerName: "Birthdate", field: "birthDate", sortable: true, filter: true, resizable: true},
    { headerName: "Gender", field: "gender", sortable: true, filter: true, resizable: true},
    { headerName: "ID", field: "id", sortable: true, filter: true, resizable: true},
  ];
  const [rowData, setRowData] = useState([
    {givenNames: "Adam", familyName: "ThisisAnExample", birthDate: "1970-05-06", gender: "male", id: 123126969},
    {givenNames: 'Abbey',familyName: 'Goodwin', birthDate: "1979-09-06", gender: "male", id: 1777777}
  ])

  const onSearchSubmit = async (queryType, queryValue) => {
    const searchResults = await getPatient(queryType, queryValue);
    console.log(searchResults);
    if (searchResults.total !== 0) {
      const rowData = convertSearchResultToRowData(searchResults.entry)
      setRowData(rowData)
    } else {
      // TODO: prompt the number of entries found
      console.log("No entry found.")
    }
  };

  return (
    <div>
      <SearchBar placeholder={'Search a patient name'} onSubmit={onSearchSubmit} options={searchTypes}/>

      <div className='ag-theme-balham-dark' style={{height: '70vh', width: '50vw'}}> 
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          pagination={true}
          paginationPageSize={25}
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();}}
        />
      </div>
    </div>
  );
};

export default Patient;
