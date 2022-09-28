import { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import '../stylesheets/PatientInfoBasicCard.css';

const PatientInfoBasicCard = ({ patientInfo }) => {
  const [patientBasicInfo, setPatientBasicInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!Object.keys(patientInfo).length) return;

    const patientBasicInfo = {};

    const patientFullName = patientInfo.name
      ? `${patientInfo.name[0].given.join(' ')} ${patientInfo.name[0].family}`
      : '';

    patientBasicInfo.name = patientFullName;
    patientBasicInfo.dob = patientInfo.birthDate ? patientInfo.birthDate : 'N/A';
    patientBasicInfo.gender = patientInfo.gender ? patientInfo.gender : 'N/A';
    patientBasicInfo.deceased = patientInfo.deceased ? patientInfo.deceased : 'N/A';
    patientBasicInfo.id = patientInfo.id;

    setPatientBasicInfo(patientBasicInfo);
    setLoading(false);
  }, [patientInfo]);

  return loading ? (
    <Spinner />
  ) : (
    <div class="card bg-dark basic-info-card">
      <div class="card-header">Patient's basic information</div>
      <table class="table table-dark table-borderless">
        <tbody>
          <tr>
            <td>
              <div class="card bg-dark borderless-card text-center">
                <h6 class="card-subtitle mb-2 text-muted">ID</h6>
                <h5 class="card-title">{patientBasicInfo.id}</h5>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="card bg-dark borderless-card text-center">
                <h6 class="card-subtitle mb-2 text-muted">Name</h6>
                <h5 class="card-title">{patientBasicInfo.name}</h5>
              </div>
            </td>
            <td>
              <div class="card bg-dark borderless-card text-center">
                <h6 class="card-subtitle mb-2 text-muted">Gender</h6>
                <h5 class="card-title">{patientBasicInfo.gender}</h5>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="card bg-dark borderless-card text-center">
                <h6 class="card-subtitle mb-2 text-muted">Date of birth</h6>
                <h5 class="card-title">{patientBasicInfo.dob}</h5>
              </div>
            </td>
            <td>
              <div class="card bg-dark borderless-card text-center">
                <h6 class="card-subtitle mb-2 text-muted">Deceased?</h6>
                <h5 class="card-title">{patientBasicInfo.deceased}</h5>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PatientInfoBasicCard;
