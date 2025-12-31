import React, { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";


function EmployeeDashboard() {
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedUser) return;
    setEmployee(loggedUser);
  }, []);

  if (!employee) return null;

  const handleGetStarted = () => {
    alert("Get Started clicked!"); // Replace with redirect or function
  };

  return (
    <div className="dashboard-container">
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Card className="dashboard-card shadow-lg text-center animate-card">
          <Card.Body>
            <h1 className="fw-bold mb-4 text-primary animate-text">
              Welcome, {employee.name} 👋
            </h1>

            <p className="fst-italic text-secondary mb-5 animate-text">
              “Success is the sum of small efforts repeated day in and day out.”
            </p>

            <Button
              size="lg"
              variant="primary"
              className="px-5 py-2 animate-button"
              style={{ borderRadius: "12px" }}
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default EmployeeDashboard;
