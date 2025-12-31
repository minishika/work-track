



import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaTasks } from "react-icons/fa";

function NavbarComponent({ user, handleLogout }) {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="navbar-title">
            <FaTasks className="navbar-icon" />
            Work Tracker
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            <LinkContainer to="/about">
              <Nav.Link>About</Nav.Link>
            </LinkContainer>

            {!user && (
              <>
                <LinkContainer to="/signup">
                  <Nav.Link>Sign Up</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/login">
                  <Nav.Link>Sign In</Nav.Link>
                </LinkContainer>
              </>
            )}

            {user && (
              <Nav.Link onClick={handleLogout}>Sign Out</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;


