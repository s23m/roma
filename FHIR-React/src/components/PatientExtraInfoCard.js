import { bootstrap } from 'bootstrap'; // Need to keep this for tabs to work
import '../stylesheets/PatientInfoAdditionalCard.css';
import '../stylesheets/PatientInfoBasicCard.css';
import '../stylesheets/PatientInfo.css';
import ImmunizationRecommendation from './ImmunizationRecommendation';
import PatientAdditionalInfo from './PatientAdditionalInfo';
import AllergyIntolerance from './AllergyIntolerance';
import Procedures from './Procedures';
import MedicationStatement from './MedicationStatement';

const PatientExtraInfoCard = ({ patientInfo, id }) => {
  return (
    <div className="card bg-dark text-center">
      {/* Instructions & Conventions
      The use of each card header <li> item's attribute:
      - "id" (set it related to the tab's content with '-tab' at the end) === tab-content's "aria-labelledby"
      - "aria-controls" === tab-content's "id"
      - "data-bs-target" === "aria-controls" but with "#" at the beginning
      */}
      <div className="card-header">
        <ul className="nav nav-tabs card-header-tabs nav-fill" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link card-nav active"
              id="home-tab"
              data-bs-toggle="tab"
              data-bs-target="#home"
              type="button"
              role="tab"
              aria-controls="home"
              aria-selected="true"
            >
              Additional info
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link card-nav"
              id="profile-tab"
              data-bs-toggle="tab"
              data-bs-target="#profile"
              type="button"
              role="tab"
              aria-controls="profile"
              aria-selected="false"
            >
              Allergy intolerances
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link card-nav"
              id="contact-tab"
              data-bs-toggle="tab"
              data-bs-target="#contact"
              type="button"
              role="tab"
              aria-controls="contact"
              aria-selected="false"
            >
              Procedures
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link card-nav"
              id="medication-statement-tab"
              data-bs-toggle="tab"
              data-bs-target="#medication-statement"
              type="button"
              role="tab"
              aria-controls="medication-statement"
              aria-selected="false"
            >
              Medication statement
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link card-nav"
              id="immunization-recommendation-tab"
              data-bs-toggle="tab"
              data-bs-target="#immunization-recommendation"
              type="button"
              role="tab"
              aria-controls="immunization-recommendation"
              aria-selected="false"
            >
              Immunization Recommendation
            </button>
          </li>
        </ul>
      </div>
      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="home"
          role="tabpanel"
          aria-labelledby="home-tab"
        >
          <PatientAdditionalInfo patientInfo={patientInfo} />
        </div>
        <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
          <AllergyIntolerance patientId={id} />
        </div>
        <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
          <Procedures patientId={id} />
        </div>
        <div className="tab-pane fade" id="medication-statement" role="tabpanel" aria-labelledby="medication-statement-tab">
          <MedicationStatement patientId={id} />
        </div>
        <div className="tab-pane fade" id="immunization-recommendation" role="tabpanel" aria-labelledby="immunization-recommendation-tab">
          <ImmunizationRecommendation patientId={id} />
        </div>
      </div>
    </div>
  );
};

export default PatientExtraInfoCard;
