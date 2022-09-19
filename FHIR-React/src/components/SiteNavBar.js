import { Navbar, Collapse, Nav, NavItem } from 'reactstrap';
import { Link } from 'react-router-dom';

const SiteNavBar = () => (
  <Navbar color="dark" container="md" dark expand>
    <Link to="/" className="navbar-brand">
      ROMA FHIR
    </Link>
    <Collapse navbar>
      <Nav className="me-auto" navbar>
        <NavItem>
          <Link to="/patients" className="nav-link">
            Patients
          </Link>
        </NavItem>
      </Nav>
    </Collapse>
  </Navbar>
);

export default SiteNavBar;
