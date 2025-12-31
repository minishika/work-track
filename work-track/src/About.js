

import React from "react";
import { Container, Card } from "react-bootstrap";
import "./About.css"; 
function About() {
  return (
    <Container className="mt-5 about-container">
      <Card className="about-card text-center p-4">
        <Card.Body>
          <h2 className="about-title mb-3">About Work Tracker</h2>
          <p className="about-text">
            Work Tracker helps admins assign tasks and employees track progress
            in a simple and effective way. Stay organized, collaborate with your
            team, and complete tasks efficiently.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default About;


