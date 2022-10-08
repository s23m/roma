import Patients from '../pages/Patients';
import PatientInfo from '../pages/PatientInfo';
import SiteNavBar from '../components/SiteNavBar';
import { Container } from 'reactstrap';
import { Outlet, BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../stylesheets/App.css';

function App() {
  const AppConstantElements = (
    <div className="App">
      <SiteNavBar />
      <Container>
        <Outlet></Outlet>
      </Container>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={AppConstantElements}>
          <Route path="patients/:id" element={<PatientInfo />} />
          <Route path="patients" element={<Patients />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
