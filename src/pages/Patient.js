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
    }
  })
  return rowData;
};

// More to be added from available params of http://hapi.fhir.org/baseR4/
const searchTypes = ['name', 'family', 'birthdate', 'phone', 'gender'] 

const Patient = () => {
  // ag-grid-table variables
  const columnDefs = [
    { headerName: "Given names", field: "givenNames", sortable: true, filter: true, minWidth: 100, maxWidth: 150},
    { headerName: "Family name", field: "familyName", sortable: true, filter: true, minWidth: 100, maxWidth: 150},
  ];
  const [rowData, setRowData] = useState([
    {givenNames: "Adam", familyName: "ThisisAnExample"},
    {givenNames: 'Abbey',familyName: 'Goodwin'}
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

      <div className='ag-theme-balham-dark' style={{height: 400, width: 600}}> 
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          pagination={true}
          paginationPageSize={25}
          resizable={true}
        />
      </div>
    </div>
  );
};

export default Patient;
