import React, { Component } from 'react'
import TrashButton from './TrashButton'
import './Book.css'
import { NavLink } from 'react-router-dom'
import { Row, Container, Button, Form, Col } from 'react-bootstrap'

class Book extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bookId: this.props.bookId,
      updateClicked: false,
      saveClicked: false,
      newTitle: this.props.title,
      newAuthor: this.props.author,
    }
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleAuthorChange = this.handleAuthorChange.bind(this)
    this.handleUpdateBook = this.handleUpdateBook.bind(this)
    this.handleSaveUpdate = this.handleSaveUpdate.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  handleTitleChange(event) {
    this.setState({ newTitle: event.target.value })
  }

  handleAuthorChange(event) {
    this.setState({ newAuthor: event.target.value })
  }

  handleUpdateBook(event) {
    event.preventDefault()
    this.setState({ updateClicked: true })
  }

  handleCancel(event) {
    event.preventDefault()
    this.setState({ updateClicked: false })
  }

  handleSaveUpdate(event) {
    event.preventDefault()
    fetch('http://localhost:5000/update-book', {
      method: 'POST',
      mode: 'cors', // no-cors, cors, *same-origin
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        id: this.props.bookId,
        newTitle: this.state.newTitle,
        newAuthor: this.state.newAuthor,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.props.onBookUpdate(
          this.props.bookId,
          data.id,
          this.state.newTitle,
          this.state.newAuthor
        )
        this.setState({ updateClicked: false })
      })
      .catch(error => console.error(error))
  }

  render() {
    if (this.state.updateClicked) {
      return (
        <Container>
          <div className="updateForm">
            <Form onSubmit={this.onBookUpdate}>
              <Row>
                <Col>
                  <Form.Group controlId="newTitle">
                    <Form.Label />
                    <Form.Control
                      type="text"
                      value={this.state.newTitle}
                      onChange={this.handleTitleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label />
                    <Form.Control
                      type="text"
                      value={this.state.newAuthor}
                      onChange={this.handleAuthorChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
            <Row>
              <Col sm={9} />
              <Col sme={3}>
                <Button className="updateFormBtn" onClick={this.handleCancel}>
                  <i className="fas fa-arrow-left" />
                </Button>
                <Button
                  className="updateFormBtn"
                  onClick={this.handleSaveUpdate}
                >
                  <i class="fab fa-telegram-plane" />
                </Button>
              </Col>
            </Row>
          </div>
        </Container>
      )
    } else {
      return (
        <Container>
          <Row>
            <TrashButton
              bookId={this.props.bookId}
              onBookDelete={this.props.onBookDelete}
            />
            <Button className="updateButton" onClick={this.handleUpdateBook}>
              <i className="fas fa-pencil-alt" />
            </Button>
            <NavLink to={`user/${this.props.userId}/book/${this.props.bookId}`}>
              {this.props.title} - {this.props.author}
            </NavLink>
          </Row>
        </Container>
      )
    }
  }
}

export default Book
