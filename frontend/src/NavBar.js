import React, { Component } from 'react'
import {
  Container,
  Row,
  Col,
  Nav,
  Navbar,
  NavItem,
  Button,
} from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import './NavBar.css'

class NavBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: this.props.isLoggedIn,
    }
    this.handleLogout = this.handleLogout.bind(this)
  }
  handleLogout(event) {
    event.preventDefault()
    fetch('http://localhost:5000/logout', {
      method: 'POST',
      mode: 'cors', // no-cors, cors, *same-origin
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.props.onLogout()
      })
      .catch(error => console.error(error))
  }
  render() {
    if (this.props.isLoggedIn) {
      return (
        <Container>
          <Row>
            <Col lg={10}>
              <Navbar>
                <Nav className="mynav">
                  <NavItem>
                    <LinkContainer to="/">
                      <span className="navlink">Home</span>
                    </LinkContainer>
                  </NavItem>
                  <NavItem>
                    <LinkContainer to="/books">
                      <span className="navlink">Your Library</span>
                    </LinkContainer>
                  </NavItem>
                  <NavItem>
                    <LinkContainer to="/users">
                      <span className="navlink">Users</span>
                    </LinkContainer>
                  </NavItem>
                </Nav>
              </Navbar>
            </Col>
            <Col>
              <Navbar lg={2} className="logoutPosition">
                <Button className="logoutBtn" onClick={this.handleLogout}>
                  Logout
                </Button>
              </Navbar>
            </Col>
          </Row>
        </Container>
      )
    } else {
      return (
        <Container>
          <Redirect push to="/" />
          <Navbar>
            <Nav className="mynav">
              <NavItem>
                <LinkContainer to="/">
                  <span className="navlink">Home</span>
                </LinkContainer>
              </NavItem>
              <NavItem>
                <LinkContainer to="/register">
                  <span className="navlink">Register</span>
                </LinkContainer>
              </NavItem>
              <NavItem>
                <LinkContainer to="/login">
                  <span className="navlink">Login</span>
                </LinkContainer>
              </NavItem>
            </Nav>
          </Navbar>
        </Container>
      )
    }
  }
}

export default NavBar
