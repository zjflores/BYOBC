import React, { Component } from 'react'
import moment from 'moment'
import { NavLink } from 'react-router-dom'
import { Container, Row, Col, Button } from 'react-bootstrap'
import './Base.css'

class BookInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      name: '',
      genres: [],
      startDate: 'No date given',
      endDate: 'No date given',
      authorized: false,
      readers: [],
    }
    this.getAuthorization = this.getAuthorization.bind(this)
    this.getTitle = this.getTitle.bind(this)
    this.getName = this.getName.bind(this)
    this.getBookGenres = this.getBookGenres.bind(this)
    this.getStartDate = this.getStartDate.bind(this)
    this.getEndDate = this.getEndDate.bind(this)
    this.getReaders = this.getReaders.bind(this)
  }
  getTitle() {
    fetch('http://localhost:5000/get-title', {
      method: 'POST',
      mode: 'cors', // no-cors, cors, *same-origin
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        id: this.props.match.params.bookId,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({ title: data })
      })
      .catch(error => console.error(error))
  }

  getAuthorization() {
    fetch('http://localhost:5000/get-authorization', {
      method: 'POST',
      mode: 'cors', // no-cors, cors, *same-origin
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        id: this.props.match.params.id,
      }),
    })
      .then(response => {
        if (response.status === 200) {
          console.log('authorized')
          this.setState({ authorized: true })
          return response.json()
        }
      })
      .then(data => {
        console.log(data)
      })
      .catch(error => console.error(error))
  }

  getName() {
    fetch('http://localhost:5000/get-name', {
      method: 'POST',
      mode: 'cors', // no-cors, cors, *same-origin
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        id: this.props.match.params.id,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({ name: data })
      })
      .catch(error => console.error(error))
  }

  getBookGenres() {
    fetch('http://localhost:5000/get-bookgenres', {
      method: 'POST',
      mode: 'cors', // no-cors, cors, *same-origin
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        id: this.props.match.params.bookId,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({ genres: data })
      })
      .catch(error => console.error(error))
  }
  getStartDate() {
    fetch('http://localhost:5000/get-start-date', {
      method: 'POST',
      mode: 'cors', // no-cors, cors, *same-origin
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        id: this.props.match.params.id,
        book_id: this.props.match.params.bookId,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data != null) {
          data = moment(data).format('MMMM Do gggg')
          this.setState({ startDate: data })
        }
      })
      .catch(error => console.error(error))
  }
  getEndDate() {
    fetch('http://localhost:5000/get-end-date', {
      method: 'POST',
      mode: 'cors', // no-cors, cors, *same-origin
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        id: this.props.match.params.id,
        book_id: this.props.match.params.bookId,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data != null) {
          data = moment(data).format('MMMM Do gggg')
          this.setState({ startDate: data })
        }
      })
      .catch(error => console.error(error))
  }

  getReaders() {
    fetch('http://localhost:5000/get-readers', {
      method: 'POST',
      mode: 'cors', // no-cors, cors, *same-origin
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        id: this.props.match.params.id,
        book_id: this.props.match.params.bookId,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data != null) {
          this.setState({ readers: data })
        } else {
          this.setState({ readers: ['No other readers'] })
        }
      })
  }

  componentDidMount() {
    this.getAuthorization()
    this.getBookGenres()
    this.getTitle()
    this.getName()
    this.getStartDate()
    this.getEndDate()
    this.getReaders()
  }
  render() {
    console.log('######### lol', this.state)

    return (
      <Container>
        <div className="bookInfo">
          <br />
          <h2>{this.state.title}</h2>
          <br />
          <Row className="bookCols">
            <Col lg={6}>
              <Row>
                <h3>You started this book on: </h3>
              </Row>
              <Row>{this.state.startDate}</Row>
              <Row>
                <h3>You finished this book on:</h3>
              </Row>
              <Row>{this.state.endDate}</Row>
            </Col>
            <Col lg={6}>
              <Row>
                <h3>Genres</h3>
              </Row>
              {(this.state.genres || []).map(genre => {
                return (
                  <Row>
                    <div key={genre.genre}>{genre.genre}</div>
                  </Row>
                )
              })}
              <Row>
                <h3>Other Readers</h3>
              </Row>
              {this.state.readers.map(reader => {
                return (
                  <div key={reader.id}>
                    <Row>
                      <NavLink
                        to={`/user/${reader.id}/book/${
                          this.props.match.params.bookId
                        }`}
                      >
                        {reader.name}
                      </NavLink>
                    </Row>
                  </div>
                )
              })}
            </Col>
          </Row>
          <br />
          {this.state.authorized && (
            <div>
              <h3> Want to add more info?</h3>
              <NavLink
                to={`/user/${this.props.match.params.id}/book/${
                  this.props.match.params.bookId
                }/update`}
              >
                <Button className="btnSignIn" sz="lg">
                  Click here
                </Button>
              </NavLink>
              <br />
            </div>
          )}
          <br />
        </div>
      </Container>
    )
  }
}

export default BookInfo
