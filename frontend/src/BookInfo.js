import React, { Component } from 'react'
import moment from 'moment'
import { NavLink } from 'react-router-dom'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import './Base.css'

class BookInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      name: '',
      genres: [],
      startDate: 'No start date given',
      endDate: 'Reading still in progress',
      authorized: false,
      readers: [],
      available: false,
      clickedCheck: false,
      clickedAdd: false,
      library: '2931',
      overDriveData: false,
      availabilityType: false,
      copiesOwned: '',
      copiesAvailable: '',
      numberOfHolds: '',
      link: '',
    }
    this.handleSelect = this.handleSelect.bind(this)
    this.getAuthorization = this.getAuthorization.bind(this)
    this.getTitle = this.getTitle.bind(this)
    this.getName = this.getName.bind(this)
    this.getBookGenres = this.getBookGenres.bind(this)
    this.getStartDate = this.getStartDate.bind(this)
    this.getEndDate = this.getEndDate.bind(this)
    this.getReaders = this.getReaders.bind(this)
    this.checkAvailability = this.checkAvailability.bind(this)
    this.addTitle = this.addTitle.bind(this)
  }

  handleSelect(event) {
    this.setState({ library: event.target.value })
  }
  checkAvailability(event) {
    event.preventDefault()
    this.setState({ clickedCheck: true })
    this.setState({ availabilityType: false })
    this.setState({ copiesOwned: '' })
    this.setState({ copiesAvailable: '' })
    this.setState({ numberOfHolds: '' })
    this.setState({ link: '' })

    fetch('http://localhost:5000/check-library', {
      method: 'POST',
      mode: 'cors', // no-cors, cors, *same-origin
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        library_code: this.state.library,
        title: this.state.title,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({ clickedCheck: false })
        this.setState({ available: data.available })
        if (data.availabilityType) {
          this.setState({ availabilityType: true })
          this.setState({ copiesOwned: data.copiesOwned })
          this.setState({ copiesAvailable: data.copiesAvailable })
          this.setState({ numberOfHolds: data.numberOfHolds })
          this.setState({ link: data.link })
        }
      })
      .catch(error => console.error(error))
      .finally(() => {
        this.setState({ overDriveData: true })
      })
  }

  addTitle() {
    fetch('http://localhost:5000/add-title', {
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
        this.setState({ clickedAdd: true })
      })
      .catch(error => console.error(error))
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
          this.setState({ endDate: data })
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
              {!this.state.authorized && (
                <Row>
                  <Col>
                    <Row>
                      <h3>
                        Check{' '}
                        <img
                          className="overdriveLogo"
                          src="/OverDrive_Logo.png"
                          alt="OverDrive Logo"
                        />
                      </h3>
                    </Row>
                    <Form onSubmit={this.checkAvailability}>
                      <Row>
                        <Form.Group
                          className="overdriveForm"
                          controlId="library"
                        >
                          <Form.Label>Choose a Library: </Form.Label>
                          <Form.Control
                            as="select"
                            value={this.state.library}
                            onChange={this.handleSelect}
                          >
                            <option value="2931">Berkeley</option>
                            <option value="2094">Oakland</option>
                            <option value="1683">San Francisco</option>
                          </Form.Control>
                          <Button
                            type="Submit"
                            className="btnSignIn"
                            onClick={this.checkAvailability}
                            block
                          >
                            Submit
                          </Button>
                        </Form.Group>
                      </Row>
                    </Form>

                    <br />
                    {this.state.clickedCheck && <Row>loading...</Row>}
                    {this.state.overDriveData &&
                      !this.state.clickedCheck &&
                      !this.state.availabilityType && (
                        <Row>
                          {this.state.title} is not available at your library
                        </Row>
                      )}
                    {this.state.overDriveData &&
                      !this.state.clickedCheck &&
                      this.state.availabilityType && (
                        <div>
                          {this.state.available ? (
                            <Row>
                              <Col>
                                <Row>{this.state.title} is available</Row>
                                <Row>
                                  Click
                                  <a
                                    className="overdriveLink"
                                    href={this.state.link}
                                  >
                                    here
                                  </a>
                                  to check it out
                                </Row>
                              </Col>
                            </Row>
                          ) : (
                            <Row>
                              <Col>
                                <Row>
                                  {this.state.title} is not currently available
                                </Row>
                                <Row>
                                  Click
                                  <a
                                    className="overdriveLink"
                                    href={this.state.link}
                                  >
                                    here
                                  </a>
                                  to place a hold
                                </Row>
                              </Col>
                            </Row>
                          )}
                          <Row>
                            <Col>
                              <Row>Copies Owned: {this.state.copiesOwned}</Row>
                              <Row>
                                Copies Available: {this.state.copiesAvailable}
                              </Row>
                              <Row>
                                Number of Holds: {this.state.numberOfHolds}
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      )}
                  </Col>
                </Row>
              )}
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
                    <Row>{reader.name}</Row>
                  </div>
                )
              })}
              {!this.state.authorized && (
                <Row>
                  <Col>
                    <Row>
                      <h3> Add this title to your library?</h3>
                    </Row>
                    {this.state.clickedAdd ? (
                      <Row>Book has been added to your library</Row>
                    ) : (
                      <Row>
                        <Button className="btnSignIn" onClick={this.addTitle}>
                          Click Me
                        </Button>
                      </Row>
                    )}
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
          <Col>
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
          </Col>
        </div>
      </Container>
    )
  }
}

export default BookInfo
