import '../stylesheets/App.css';
import Patient from '../pages/Patient';
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
          <Route path="patients" element={Patient()} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
