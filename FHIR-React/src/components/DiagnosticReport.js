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
 * @param {Object} entries 
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
 * Organise and return an object whose data can be passed straight into rowData property of  `ResultModal`'s `AgGridReact` component
 * @param {Object} entries 
 */
const convertResult = (entries) => {
  const rowDataResult = entries.map( (entry) => {
    const resource = entry.resource;
    return {
      result: resource.result || [], 
    }
  });
  return rowDataResult;
}

/**
 * Return a Button component that shows ResultModal when clicked
 * @param {*} params used to get values from targeted AgGridReact cell
 * @param {Function} setModalShow function that updates the state of `modalShow`
 * @param {Function} setClickedRowNumber function that updates the state of `clickedRowNumber`
 * @returns 
 */
const ResultButton = (params, setModalShow, setClickedRowNumber) => {
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

/**
 * A modal to display result of selected individual Diagnostic Report
 * @param {Object} propsOriginal properties of the Modal
 * @returns a Modal component
 */
const ResultModal = (propsOriginal) => {
  const {clickedRowNumber, data, ...props} = propsOriginal
  // AgGridReact variables
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
  const [clickedRowNumber, setClickedRowNumber] = useState(2); // to keep track of clicked button's row index


  // AgGridReact variables
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
                    cellRenderer: (params) =>  ResultButton(params, setModalShow, setClickedRowNumber)},
    ],
    domLayout: 'autoHeight', 
    onGridReady: (params) => params.api.sizeColumnsToFit(),
  }

  // Get and update patient's ImmunizationRecommendation data
  useEffect(() => {
    setLoading(true);
    getDiagnosticReport(patientId)
      .then((response) => {
        console.log('Diagnostic Report response:', response); // for debugging

        // set data for ag-grid
        if (response.total !== 0) {
          const data = convertEntry(response.entry)
          const dataResult = convertResult(response.entry)
          setRowData(data)
          setRowDataResult(dataResult)
        }
        setLoading(false)
      })
  }, [patientId]);

  return loading ? (
    <Spinner />
  ) : (
    <>
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
    </>
  );
}
