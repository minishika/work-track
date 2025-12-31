


import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Table,
  Button,
  Badge,
  Modal,
} from "react-bootstrap";
import { FaUsers, FaTasks, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import axios from "axios";

function AdminDashboard() {
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [showTLModal, setShowTLModal] = useState(false);
  const [selectedTL, setSelectedTL] = useState(null);

  const [showEmpModal, setShowEmpModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  const [previewImage, setPreviewImage] = useState(null); // <-- Added for screenshot preview

  const token = localStorage.getItem("token"); // JWT token

  // ===================== FETCH USERS =====================
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeamLeaders(res.data.filter((u) => u.role === "teamleader"));
      setEmployees(res.data.filter((u) => u.role === "employee"));
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===================== DOMAIN BASED FILTER =====================
  const getEmployeesUnderTL = (domain) => {
    return employees.filter((emp) => emp.domain === domain);
  };

  // ===================== ASSIGN EMPLOYEE AS TEAM LEADER =====================
  const assignAsTeamLeader = async (empId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/admin/assignTeamLeader/${empId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Employee assigned as Team Leader!");
      fetchUsers(); // Refresh data
      setShowEmpModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to assign team leader");
    }
  };

  return (
    <Container className="mt-4">
      <h3 className="text-center text-warning fw-bold mb-4">Admin Dashboard</h3>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow text-center">
            <Card.Body>
              <FaUsers size={30} className="text-success mb-2" />
              <h5>Team Leaders</h5>
              <h3>{teamLeaders.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow text-center">
            <Card.Body>
              <FaTasks size={30} className="text-warning mb-2" />
              <h5>Employees</h5>
              <h3>{employees.length}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow mb-4">
        <Card.Body>
          <h5 className="fw-bold mb-3">Team Leaders</h5>

          <Table bordered hover responsive className="text-center align-middle">
            <thead className="table-primary">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Domain</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {teamLeaders.map((tl) => (
                <tr key={tl._id}>
                  <td>{tl.employeeId || tl._id.slice(-4)}</td>
                  <td>{tl.name}</td>
                  <td>{tl.domain}</td>
                  <td>{tl.email}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      className="me-2"
                      onClick={() => {
                        setSelectedTL(tl);
                        setShowTLModal(true);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => (window.location = `mailto:${tl.email}`)}
                    >
                      <FaEnvelope />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* ===================== TEAM LEADER MODAL ===================== */}
      <Modal show={showTLModal} onHide={() => setShowTLModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Team Leader Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedTL && (
            <>
              <p><b>Name:</b> {selectedTL.name}</p>
              <p><b>Domain:</b> {selectedTL.domain}</p>
              <p><b>Email:</b> {selectedTL.email}</p>

              <hr />
              <h6 className="fw-bold text-primary">
                Employees under {selectedTL.name}
              </h6>

              <Table bordered size="sm" className="text-center">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {getEmployeesUnderTL(selectedTL.domain).length === 0 ? (
                    <tr>
                      <td colSpan="5">No Employees Found</td>
                    </tr>
                  ) : (
                    getEmployeesUnderTL(selectedTL.domain).map((emp) => (
                      <tr key={emp._id}>
                        <td>{emp.employeeId || emp._id.slice(-4)}</td>
                        <td>{emp.name}</td>
                        <td>
                          <Badge
                            bg={
                              emp.status === "Active"
                                ? "success"
                                : emp.status === "Moderate"
                                ? "warning"
                                : "danger"
                            }
                          >
                            {emp.status || "Inactive"}
                          </Badge>
                        </td>
                        <td>{emp.email}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="info"
                            className="me-2"
                            onClick={() => {
                              setSelectedEmp(emp);
                              setShowEmpModal(true);
                              setShowTLModal(false);
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => (window.location = `mailto:${emp.email}`)}
                          >
                            <FaEnvelope />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* ===================== EMPLOYEE MODAL ===================== */}
      <Modal show={showEmpModal} onHide={() => setShowEmpModal(false)} centered size="lg">
        <Modal.Header>
          <Button
            variant="secondary"
            onClick={() => {
              setShowEmpModal(false);
              setShowTLModal(true);
            }}
          >
            <FaArrowLeft /> Back
          </Button>
          <Modal.Title className="ms-3">Employee Details</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center" style={{ padding: "30px" }}>
          {selectedEmp && (
            <>
              <h5>ID: {selectedEmp.employeeId || selectedEmp._id.slice(-4)}</h5>
              <h5>Name: {selectedEmp.name}</h5>
              <p>Email: {selectedEmp.email}</p>
              <Badge
                bg={
                  selectedEmp.status === "Active"
                    ? "success"
                    : selectedEmp.status === "Moderate"
                    ? "warning"
                    : "danger"
                }
              >
                {selectedEmp.status || "Inactive"}
              </Badge>

              <hr />

              <Button
                variant="primary"
                className="mt-3"
                onClick={() => assignAsTeamLeader(selectedEmp._id)}
              >
                Assign as Team Leader
              </Button>

              <hr />
              <h6 className="fw-bold mt-3">Work Screenshots</h6>
              <Row className="mt-3">
                {selectedEmp.screenshots && selectedEmp.screenshots.length > 0 ? (
                  selectedEmp.screenshots.map((img, index) => (
                    <Col md={4} key={index} className="mb-3">
                      <img
                        src={img}
                        alt="work"
                        className="img-fluid rounded shadow"
                        style={{ cursor: "pointer" }}
                        onClick={() => setPreviewImage(img)} // <-- click to preview
                      />
                    </Col>
                  ))
                ) : (
                  <p>No screenshots uploaded</p>
                )}
              </Row>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* ===================== SCREENSHOT PREVIEW MODAL ===================== */}
        <Modal
  show={!!previewImage}
  onHide={() => setPreviewImage(null)}
  centered
  size="xl"
  backdrop="static"
  contentClassName="border-0"
>
  {/* IMAGE AREA */}
  <Modal.Body
    className="p-0"
    style={{
      background: "black",
    }}
  >
    <img
      src={previewImage}
      alt="Preview"
      style={{
        width: "100%",
        height: "auto",
        maxHeight: "70vh",
        objectFit: "contain",
        display: "block",
      }}
    />
  </Modal.Body>

  {/* GREY FOOTER WITH CLOSE BUTTON */}
  <Modal.Footer
    className="justify-content-center"
    style={{
      background: "#6c757d",
      borderTop: "none",
    }}
  >
    <Button
      variant="light"
      className="px-5"
      onClick={() => setPreviewImage(null)}
    >
      Close
    </Button>
  </Modal.Footer>
</Modal>

    </Container>
  );
}

export default AdminDashboard;



