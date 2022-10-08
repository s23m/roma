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

  const rowData = entries.map( (entry) => {
    const resource = entry.resource;
    return {
      id: resource.id,
      status: resource.status,
      report: resource.code.coding[0].display || resource.code.coding[0].display || 'N/A',
      category: getCategory(resource),
      result: resource.result? resource.result[0].reference : 'N/A',
    }
  });
  return rowData;
};

const buttonResult = (params, setModalShow) => {
  return (
    <Button variant="primary" onClick={() => setModalShow(true)}>View result</Button>
  )
}

const ResultModal = (props) => {
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
            Bla Blo
            <AgGridReact
              // gridOptions={gridOptions}
              // rowData={rowData}
            />
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
  const [modalShow, setModalShow] = useState(false);


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
      { headerName: 'ID', field: 'id', minWidth: 110 },
      { headerName: 'Report', field: 'report', minWidth: 110 },
      { headerName: 'Category', field: 'category', minWidth: 110 },
      { headerName: 'Status', field: 'status', minWidth: 110 },
      { headerName: 'Result', field: 'result', minWidth: 110,
            cellRenderer: (params) =>  buttonResult(params, setModalShow)},
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
            setRowData(data)
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
            gridOptions={gridOptions}
            rowData={rowData}
          />

          <ResultModal
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
        </div>
      ) : (<br/>)}
    </div>
  );
}
