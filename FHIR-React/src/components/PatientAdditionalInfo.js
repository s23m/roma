import { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';

const NA_ARRAY = ['N/A'];

const getPatientTelecomInfo = (patientInfo) => {
  if (!patientInfo.telecom || patientInfo.telecom.length === 0) return NA_ARRAY;

  const validPatientTelecoms = patientInfo.telecom.filter(
    (telecom) => !!telecom.use && !!telecom.system && !!telecom.value
  );

  const patientTelecoms = validPatientTelecoms.map(
    (telecom) => `${telecom.use} ${telecom.system}: ${telecom.value}`
  );

  return patientTelecoms.length > 0 ? patientTelecoms : NA_ARRAY;
};

const getPatientIdentifiers = (patientInfo) => {
  if (!patientInfo.identifier || patientInfo.identifier.length === 0) return NA_ARRAY;

  const validPatientIdentifiers = patientInfo.identifier.filter(
    (identifier) =>
      !!identifier.type && !!identifier.type.coding && identifier.type.coding.length > 0
  );

  const patientIdentifierInfo = validPatientIdentifiers.map(
    (identifier) => `${identifier.type.coding[0].display}: ${identifier.value}`
  );

  return patientIdentifierInfo.length > 0 ? patientIdentifierInfo : NA_ARRAY;
};

const getPatientCommunicationInfo = (patientInfo) => {
  if (!patientInfo.communication || patientInfo.communication.length === 0) return NA_ARRAY;

  const validCommunications = patientInfo.communication.filter(
    (comm) =>
      !!comm.language.coding && comm.language.coding.length > 0 && !!comm.language.coding[0].display
  );

  const patientCommunications = validCommunications.map((comm) => comm.language.coding[0].display);

  return patientCommunications;
};

// Address can be in different formats given different locations, so it is difficult to correctly show address
// showing json instead
const getPatientAddress = (patientInfo) => {
  if (!patientInfo.address || typeof patientInfo.address !== 'object') return 'N/A';

  return JSON.stringify(patientInfo.address);
};

const getMaritalStatus = (patientInfo) => {
  if (!patientInfo.maritalStatus) return NA_ARRAY;
  if (patientInfo.maritalStatus) {
    return patientInfo.maritalStatus.coding[0].display
  }
}
const createArrayCardBody = (arr) =>
  arr.map((element) => {
    return (
      <>
        {element}
        <br />
      </>
    );
  });

const PatientAdditionalInfo = ({ patientInfo }) => {
  const [patientAdditionalInfo, setPatientAdditionalInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!Object.keys(patientInfo).length) return;

    const patientAdditionalInfo = {};

    patientAdditionalInfo.identifier = getPatientIdentifiers(patientInfo);
    patientAdditionalInfo.telecom = getPatientTelecomInfo(patientInfo);
    patientAdditionalInfo.communication = getPatientCommunicationInfo(patientInfo);
    patientAdditionalInfo.address = getPatientAddress(patientInfo);
    patientAdditionalInfo.active = patientInfo.active ? patientInfo.active : 'N/A';
    patientAdditionalInfo.maritalStatus = getMaritalStatus(patientInfo);

    setPatientAdditionalInfo(patientAdditionalInfo);
    setLoading(false);
  }, [patientInfo]);

  return loading ? (
    <Spinner />
  ) : (
    <table className="table table-dark table-borderless">
      <tbody>
        <tr>
          <td>
            <div className="card bg-dark borderless-card text-center">
              <h6 className="card-subtitle mb-2 text-muted">Identifiers</h6>
              <h5 className="card-title text-left">
                {createArrayCardBody(patientAdditionalInfo.identifier)}
              </h5>
            </div>
          </td>
          <td>
            <div className="card bg-dark borderless-card text-center">
              <h6 className="card-subtitle mb-2 text-muted">Contact</h6>
              <h5 className="card-title text-left">{createArrayCardBody(patientAdditionalInfo.telecom)}</h5>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div className="card bg-dark borderless-card text-center">
              <h6 className="card-subtitle mb-2 text-muted">Languages</h6>
              <h5 className="card-title text-left">
                {createArrayCardBody(patientAdditionalInfo.communication)}
              </h5>
            </div>
          </td>
          <td>
            <div className="card bg-dark borderless-card text-center">
              <h6 className="card-subtitle mb-2 text-muted">Address</h6>
              <h5 className="card-title text-left" text-left>{patientAdditionalInfo.address}</h5>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="card bg-dark borderless-card text-center">
              <h6 className="card-subtitle mb-2 text-muted">Marital status</h6>
              <h5 className="card-title text-left">{patientAdditionalInfo.maritalStatus}</h5>
            </div>
          </td>
          <td>
            <div class="card bg-dark borderless-card text-center">
              <h6 className="card-subtitle mb-2 text-muted">Active?</h6>
              <h5 className="card-title text-left">{patientAdditionalInfo.active}</h5>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default PatientAdditionalInfo;
