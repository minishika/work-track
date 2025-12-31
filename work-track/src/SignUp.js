



import React, { useState } from "react";
import { Card, Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import api from "./api";

function SignUp({ handleLogin }) {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/signup", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      handleLogin(res.data.user);

      if (res.data.user.role === "admin") navigate("/admin-dashboard");
      else if (res.data.user.role === "teamleader") navigate("/team-leader-dashboard");
      else navigate("/employee-dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <Container className="signup-container fade-in">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h3 className="text-center mb-3">Sign Up</h3>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={submitHandler}>
                {["name","id","phone","email","password","role","domain"].map((f) => (
                  <Form.Control
                    key={f}
                    className="mb-2"
                    placeholder={f}
                    onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  />
                ))}

                <Button type="submit" className="w-100 mt-2">
                  Create Account
                </Button>
              </Form>

              <div className="text-center mt-3">
                Already registered? <Link to="/login">Sign In</Link>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUp;

