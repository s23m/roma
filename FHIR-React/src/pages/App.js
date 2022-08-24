import '../stylesheets/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Patients from '../pages/Patients';
import PatientInfo from '../pages/PatientInfo';
import { Container } from 'reactstrap';
import { Outlet, BrowserRouter, Routes, Route } from 'react-router-dom';
import SiteNavBar from '../components/SiteNavBar';

function App() {
  const AppConstantElements = (
    <div className="App">
      <SiteNavBar />
      <Container>
        <h1>ROMA FHIR</h1>
        <Outlet></Outlet>
      </Container>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={AppConstantElements}>
          <Route path="patients/:id" element={<PatientInfo/>} />
          <Route path="patients" element={<Patients />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
