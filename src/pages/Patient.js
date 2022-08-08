import React, { useState, useMemo } from 'react';
import { Table } from 'reactstrap';
import { searchPatientByPhonetic } from '../apis/patient';
import SearchBar from '../components/SearchBar';

const convertSearchResultToTableData = (searchResults) => {
  const tableData = searchResults.map((patient) => {
    const givenNames = patient.resource.name[0].given;
    const givenNamesString = givenNames.join(' ');
    const familyName = patient.resource.name[0].family;

    return {
      givenName: givenNamesString,
      familyName: familyName,
    };
  });

  return tableData;
};

const Patient = () => {
  const [patientData, setPatientData] = useState([
    {
      givenNames: 'Abbey',
      lastName: 'Goodwin',
    },
  ]);
  const [columnDefs, setColumnDefs] = useState([
    { field: 'Given names' },
    { field: 'Family name' },
  ]);

  const onSearchSubmit = async (queryValue) => {
    const searchResults = await searchPatientByPhonetic(queryValue);
    const tableData = convertSearchResultToTableData(searchResults.entry);

    setPatientData(tableData);
  };

  const tableRows = useMemo(
    () =>
      patientData.map((patient, i) => {
        const cells = Object.keys(patient).map((key, j) => (
          <td key={`col${i}-${j}`}>{patient[key]}</td>
        ));
        return <tr key={`row${i}`}>{cells}</tr>;
      }),
    [patientData]
  );

  const tableHeadings = useMemo(
    () => columnDefs.map((def, i) => <th key={`heading${i}`}>{def.field}</th>),
    [columnDefs]
  );

  return (
    <>
      <SearchBar placeholder={'Search a patient name'} onSubmit={onSearchSubmit} />
      <Table dark>
        <thead>
          <tr>{tableHeadings}</tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </Table>
    </>
  );
};

export default Patient;
