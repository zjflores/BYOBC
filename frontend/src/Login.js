import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { Container, Form, Button, Row, Col } from 'react-bootstrap'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: this.props.isLoggedIn,
      email: '',
      password: '',
    }
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value })
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()
    fetch('http://localhost:5000/login', {
      method: 'POST',
      mode: 'cors', // no-cors, cors, *same-origin
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then(response => {
        if (response.status === 202) {
          console.log('SUCCESSS')
          this.props.onLogin()
          return response.json()
        } else if (response.status === 401) {
          console.log('uh-oh')
        }
      })
      .then(data => {
        console.log(data)
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
          <h2>Login</h2>
          <Form onSubmit={this.handleSubmit}>
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
              Sign In
            </Button>
            <br />
          </Form>
        </Container>
      )
    }
  }
}
export default Login
