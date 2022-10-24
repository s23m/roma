import React from 'react';
import { Container, Card, CardTitle, CardText, CardBody, CardSubtitle, List } from 'reactstrap';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <Container>
    <Card color="dark">
      <CardBody className="homepage-card-body">
        <div className="homepage-heading">
          <CardTitle tag="h3" className="homepage-card-title">
            Welcome to ROMA FHIR
          </CardTitle>
        </div>
        <CardTitle tag="h5" className="homepage-second-card-title">
          What can you do here?
        </CardTitle>
        <CardText className="homepage-card-text">
          Get patient medical information via the{' '}
          <Link to="/patients" className="link">
            patients
          </Link>{' '}
          page
        </CardText>
      </CardBody>
    </Card>
  </Container>
);

export default HomePage;
