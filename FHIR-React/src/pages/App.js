import '../stylesheets/App.css';
import Patients from '../pages/Patients';
import { Container } from 'reactstrap';
import { Outlet, BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const AppConstantElements = (
    <div className="App">
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
          <Route path="patients" element={<Patients />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
