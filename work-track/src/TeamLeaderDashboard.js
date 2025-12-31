



import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const TeamLeaderDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [chartData, setChartData] = useState([]);

  const token = localStorage.getItem("token"); // JWT token
  const user = JSON.parse(localStorage.getItem("user")); // Logged-in team leader info
  const teamLeaderId = user?._id;

  // Fetch employees assigned to the logged-in team leader
  useEffect(() => {
  const fetchEmployees = async () => {
    try {
      if (!teamLeaderId) return; // safety check

      const res = await axios.get(
        `http://localhost:5000/api/teamleader/${teamLeaderId}/employees`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    } finally {
      setLoading(false);
    }
  };

  fetchEmployees();
}, [teamLeaderId, token]);


  const openProfile = (emp) => {
    setSelectedEmployee(emp);
    setChartData(Array.from({ length: 11 }, () => Math.floor(Math.random() * 6))); // Example performance
  };

  const closeProfile = () => {
    setSelectedEmployee(null);
    setPreviewImage(null);
  };

  const sendMail = (email, name) => {
    window.location.href = `mailto:${email}?subject=Hello ${name}&body=Hi ${name},`;
  };

  const getStatusBadge = (status) => {
    const baseStyle = {
      padding: "5px 10px",
      borderRadius: "18px",
      fontWeight: "600",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      color: "#fff",
      width: "115px",
      fontSize: "0.85rem",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    };

    switch (status) {
      case "Active":
        return (
          <span style={{ ...baseStyle, background: "linear-gradient(90deg,#28a745,#2ecc71)" }}>
            Active
          </span>
        );
      case "Medium":
        return (
          <span style={{ ...baseStyle, background: "linear-gradient(90deg,#f39c12,#f1c40f)" }}>
            Medium
          </span>
        );
      case "Inactive":
        return (
          <span
            style={{
              ...baseStyle,
              background: "linear-gradient(90deg,#e74c3c,#c0392b)",
              animation: "inactivePulse 1.5s infinite",
            }}
          >
            Inactive
          </span>
        );
      default:
        return <span style={{ ...baseStyle, background: "#6c757d" }}>{status}</span>;
    }
  };

  if (loading) return <h3>Loading...</h3>;

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h4 className="text-center text-primary fw-bold mb-4">Team Leader Dashboard</h4>

        <table className="table table-striped text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td className="fw-bold">{emp.employeeId || emp._id.slice(-4)}</td>
                <td>{emp.name}</td>
                <td>{getStatusBadge(emp.status)}</td>
                <td>
                  <button className="btn btn-info btn-sm me-2" onClick={() => openProfile(emp)}>
                    View Profile
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => sendMail(emp.email, emp.name)}>
                    <FaEnvelope className="me-1" /> Send Mail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Employee profile modal */}
      {selectedEmployee && (
        <>
          <div className="modal-backdrop fade show" onClick={closeProfile} />
          <div className="modal d-block">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content shadow-lg">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    {selectedEmployee.name} ({selectedEmployee.employeeId || selectedEmployee._id.slice(-4)})
                  </h5>
                  <button className="btn-close btn-close-white" onClick={closeProfile} />
                </div>

                <div className="modal-body">
                  <div className="mb-3 p-2 rounded bg-light border">
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${selectedEmployee.email}`} className="text-primary fw-semibold">
                      {selectedEmployee.email}
                    </a>
                  </div>

                  {selectedEmployee.works && (
                    <>
                      <h6 className="fw-bold">Working Tasks</h6>
                      <ul>
                        {selectedEmployee.works.map((work, i) => (
                          <li key={i}>{work}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {selectedEmployee.screenshots && selectedEmployee.screenshots.length > 0 && (
                    <>
                      <h6 className="fw-bold mt-3">Screenshots</h6>
                      <div className="d-flex gap-2 flex-wrap">
                        {selectedEmployee.screenshots.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="Screenshot"
                            width="120"
                            height="80"
                            className="border rounded shadow-sm"
                            style={{ cursor: "pointer" }}
                            onClick={() => setPreviewImage(img)}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  <h6 className="fw-bold mt-4">Performance (9 AM – 7 PM)</h6>
                  <Bar
                    data={{
                      labels: Array.from({ length: 11 }, (_, i) => `${9 + i} AM`),
                      datasets: [{ label: "Tasks Completed", data: chartData }],
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Screenshot preview */}
      {previewImage && (
        <>
          <div className="modal-backdrop fade show" onClick={() => setPreviewImage(null)} />
          <div className="modal d-block">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content p-3 text-center shadow-lg">
                <img src={previewImage} alt="Preview" className="img-fluid rounded" />
                <button className="btn btn-secondary mt-3" onClick={() => setPreviewImage(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TeamLeaderDashboard;

