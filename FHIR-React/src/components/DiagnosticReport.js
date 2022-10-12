import { useState, useEffect } from 'react';
import { getDiagnosticReport } from '../apis/diagnosticReport';
import { Spinner } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

// Testing patient link
// http://localhost:3000/patients/30358

/**
 * Get required data and convert it to fit AgGridReact input format
 * @param {*} entries 
 * @returns rowData for AgGridReact table
 */
const convertEntry = (entries) => {
  // Assistive function
  const getCategory = (resource) => {
    if (!resource.category) return 'N/A';
    return resource.category[0].coding[0].code
  }

  const rowData = entries.map( (entry, index) => {
    const resource = entry.resource;
    return {
      id: resource.id,
      status: resource.status,
      report: resource.code.coding[0].display || resource.code.coding[0].display || 'N/A',
      category: getCategory(resource),
      result: index,  // Place index here to pass value to buttonResult(). Specifically, used in params.valueFormatted and params.value
    }
  });
  return rowData;
};

/**
 * Return an object that can be used easily in `ResultModal` to pass to Ag-grid-react component
 * @param {*} entries 
 */
const convertResult = (entries) => {
  // Assistive function
  const rowDataResult = entries.map( (entry, index) => {
    const resource = entry.resource;
    return {
      result: resource.result || [], 
    }
  });
  return rowDataResult;
}

const buttonResult = (params, setModalShow, setClickedRowNumber) => {
  const cellValue = params.valueFormatted ? params.valueFormatted : params.value;
  
  return (
    <div>
      <Button variant="primary" onClick={() => {
        setModalShow(true)
        setClickedRowNumber(cellValue)
      }}>
        View result
      </Button>
    </div>
  )
}

const ResultModal = (propss) => {
  const {clickedRowNumber, data, ...props} = propss
  // ag-grid-table variables
  const gridOptions = {
    rowHeight: '50px',
    defaultColDef: {
      filter: true,
      resizable: true,
      wrapText: true,
      autoHeight: true,
      autoWidth: true,
      editable: true,
    },
    columnDefs: [
      { headerName: 'Reference', field: 'reference', maxWidth: 220 },
      { headerName: 'Question', field: 'display', },
    ],
    domLayout: 'autoHeight', 
    onGridReady: (params) => params.api.sizeColumnsToFit(),
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Result
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
            <div  className="ag-theme-balham-dark" style={{width: '30vw'}}>
            <AgGridReact
              gridOptions={gridOptions}
              rowData={data[clickedRowNumber].result}
            />
            </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}




export default function DiagnosticReport({ patientId }) {
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [rowDataResult, setRowDataResult] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [clickedRowNumber, setClickedRowNumber] = useState(2);


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
      { headerName: 'ID', field: 'id', width: 110 },
      { headerName: 'Report', field: 'report', minWidth: 120 },
      { headerName: 'Category', field: 'category', width: 100 },
      { headerName: 'Status', field: 'status', width: 100 },
      { headerName: 'Result', field: 'result', width: 100,
                    cellRenderer: (params) =>  buttonResult(params, setModalShow, setClickedRowNumber)},
    ],
    domLayout: 'autoHeight', 
    onGridReady: (params) => params.api.sizeColumnsToFit(),
  }

  // Get and update patient's ImmunizationRecommendation data
  useEffect(() => {
    setLoading(true);
    
    getDiagnosticReport(patientId)
      .then((response) => {
        console.log('Diagnostic Report response:', response);

        // set data for ag-grid
        if (response.total !== 0) {
          const data = convertEntry(response.entry)
          const dataResult = convertResult(response.entry)
          setRowData(data)
          setRowDataResult(dataResult)
        }
        setLoading(false);
      })
  }, [patientId]);

  return loading ? (
    <Spinner />
  ) : (
    <div>
      <p>Total: {rowData.length}</p>
      {rowData.length > 0 ? (
        <div className="ag-theme-balham-dark" style={{width: '60vw'}}>
          <AgGridReact
            gridOptions = {gridOptions}
            rowData = {rowData}
            rowHeight = {36}
          />

          <ResultModal
            clickedRowNumber = {clickedRowNumber}
            data = {rowDataResult}
            show = {modalShow}
            onHide = {() => setModalShow(false)}
          />
        </div>
      ) : (<br/>)}
    </div>
  );
}
