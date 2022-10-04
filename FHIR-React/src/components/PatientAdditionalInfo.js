import { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import { extractValue } from '../apis/utils';

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
      comm.language.coding && comm.language.coding.length > 0
  );

  const patientCommunications = validCommunications.map((comm) => comm.language.coding[0].display || comm.language.coding[0].code);

  return patientCommunications;
};

const getMaritalStatus = (patientInfo) => {
  if (!patientInfo.maritalStatus) return NA_ARRAY;
  if (patientInfo.maritalStatus) {
    return patientInfo.maritalStatus.coding[0].display || patientInfo.maritalStatus.coding[0].code
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
    patientAdditionalInfo.address = extractValue(patientInfo.address);
    patientAdditionalInfo.active = patientInfo.active ? JSON.stringify(patientInfo.active) : 'N/A';
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
            <div className="card bg-dark borderless-card text-center">
              <h6 className="card-subtitle mb-2 text-muted">Marital status</h6>
              <h5 className="card-title text-left">{patientAdditionalInfo.maritalStatus}</h5>
            </div>
          </td>
          <td>
            <div className="card bg-dark borderless-card text-center">
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
