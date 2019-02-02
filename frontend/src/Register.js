import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { Container, Form, Button, Row, Col } from 'react-bootstrap'

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: this.props.isLoggedIn,
      fname: '',
      lname: '',
      email: '',
      password: '',
    }
    this.handleFnameChange = this.handleFnameChange.bind(this)
    this.handleLnameChange = this.handleLnameChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleFnameChange(event) {
    this.setState({ fname: event.target.value })
  }

  handleLnameChange(event) {
    this.setState({ lname: event.target.value })
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value })
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()
    fetch('http://localhost:5000/register', {
      method: 'POST',
      mode: 'cors', // no-cors, cors, *same-origin
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        fname: this.state.fname,
        lname: this.state.lname,
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.props.onLogin()
      })
      .catch(error => console.error(error))
  }
  render() {
    if (this.props.isLoggedIn) {
      return <Redirect push to="/books" />
    } else {
      return (
        <Container className="RegistrationLogin">
          <br />
          <h2>Register</h2>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col>
                <Form.Group controlId="formFname">
                  <Form.Label>First Name:</Form.Label>
                  <Form.Control
                    type="text"
                    value={this.state.fname}
                    required
                    onChange={this.handleFnameChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formLname">
                  <Form.Label>Last Name:</Form.Label>
                  <Form.Control
                    type="text"
                    value={this.state.lname}
                    required
                    onChange={this.handleLnameChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="forEmail">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    value={this.state.email}
                    required
                    onChange={this.handleEmailChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="password">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    value={this.state.password}
                    required
                    onChange={this.handlePasswordChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Button className="btnSignIn" type="submit" size="lg" block>
              Sign Up
            </Button>
            <br />
          </Form>
        </Container>
      )
    }
  }
}
export default Register
