import React, { Component } from 'react'
import User from './User'
import { Container, Col } from 'react-bootstrap'
import './Base.css'

class UserList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
    }
    this.getUsers = this.getUsers.bind(this)
  }
  getUsers() {
    fetch('http://localhost:5000/get-users', {
      method: 'GET',
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
        this.setState({ users: data })
      })
      .catch(error => console.error(error))
  }
  componentDidMount() {
    this.getUsers()
  }

  render() {
    return (
      <Container className="userList">
        <h2>Users</h2>
        <Col>
          {this.state.users.map(user => {
            return <User key={user.id} name={user.name} userId={user.id} />
          })}
          <br />
        </Col>
      </Container>
    )
  }
}
export default UserList
