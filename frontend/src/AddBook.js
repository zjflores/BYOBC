import React, { Component } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap'

class AddBook extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      author: '',
      bookId: '',
    }
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleAuthorChange = this.handleAuthorChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleTitleChange(event) {
    this.setState({ title: event.target.value })
  }

  handleAuthorChange(event) {
    this.setState({ author: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()
    fetch('http://localhost:5000/add-book', {
      method: 'POST',
      mode: 'cors', // no-cors, cors, *same-origin
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        title: this.state.title,
        author: this.state.author,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({ bookId: data.id })
        this.props.onBookAdd(
          this.state.title,
          this.state.author,
          this.state.bookId
        )
      })
      .catch(error => console.error(error))
  }

  render() {
    return (
      <Container>
        <h2>Add a book!</h2>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group className="titleForm" controlId="Title">
            <Form.Control
              type="text"
              value={this.state.title}
              onChange={this.handleTitleChange}
              placeholder="Title"
            />
          </Form.Group>
          <Form.Group className="authorForm" controlId="Author">
            <Form.Control
              type="text"
              value={this.state.author}
              onChange={this.handleAuthorChange}
              placeholder="Author"
            />
          </Form.Group>
          <Button className="btn" type="submit" block>
            Submit
          </Button>
        </Form>
      </Container>
    )
  }
}

export default AddBook
