



import React, { useState } from "react";
import { Card, Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "./api";

function Login({ handleLogin }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        phone,
        password,
      });

      // ✅ Save token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      handleLogin(res.data.user);

      // ✅ CORRECT ROLE-BASED REDIRECT (FIXED)
      if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (res.data.user.role === "teamleader") {
        navigate("/team-leader-dashboard");
      } else if (res.data.user.role === "employee") {
        navigate("/employee-dashboard");
      } else {
        setError("Unknown role: " + res.data.user.role);
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Container className="login-container fade-in">
      <Row className="justify-content-center w-100">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h3 className="text-center mb-4">Sign In</h3>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    required
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 12, top: 38, cursor: "pointer" }}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </Form.Group>

                <Button type="submit" className="w-100">
                  Sign In
                </Button>
              </Form>

              <div className="text-center mt-3">
                New user? <Link to="/signup">Sign Up</Link>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;





