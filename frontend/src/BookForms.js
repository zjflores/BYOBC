import React, { Component } from 'react'
import FilteredMultiSelect from 'react-filtered-multiselect'
import { Col, Row, Container, Form, Button } from 'react-bootstrap'
import './BookForm.css'

class BookForms extends Component {
  constructor(props) {
    super(props)
    console.log(this.props.match.params.bookId)
    this.state = {
      genres: [],
      selectedGenres: [],
      startDate: '',
      endDate: '',
      title: '',
    }
    this.getGenres = this.getGenres.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleDeselect = this.handleDeselect.bind(this)
    this.handleStartDateChange = this.handleStartDateChange.bind(this)
    this.handleEndDateChange = this.handleEndDateChange.bind(this)
    this.handleSubmitGenres = this.handleSubmitGenres.bind(this)
    this.handleSubmitStartDate = this.handleSubmitStartDate.bind(this)
    this.handleSubmitEndDate = this.handleSubmitEndDate.bind(this)
    this.getTitle = this.getTitle.bind(this)
  }
  handleSelect(addGenres) {
    const newSelectedGenres = this.state.selectedGenres.concat(addGenres)
    this.setState({ selectedGenres: newSelectedGenres })
  }

  handleDeselect(deselectedGenres) {
    // Object.assign({}, this.state.selectedGenres)
    const genresSelected = this.state.selectedGenres.filter(genre => {
      for (let i = 0; i < deselectedGenres.length; i++) {
        if (deselectedGenres[i].text === genre.text) {
          return false
        }
      }

      return true
    })
    this.setState({ selectedGenres: genresSelected })
  }

  handleStartDateChange(event) {
    this.setState({ startDate: event.target.value })
  }

  handleEndDateChange(event) {
    this.setState({ endDate: event.target.value })
  }

  handleSubmitStartDate(event) {
    event.preventDefault()
    fetch('http://localhost:5000/book/set-start-date', {
      method: 'POST',
      mode: 'cors', // no-cors, cors, *same-origin
      headers: {
        'Content-Type': 'application/json',
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        id: this.props.match.params.bookId,
        start: this.state.startDate,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch(error => console.error(error))
  }

  handleSubmitEndDate(event) {
    event.preventDefault()
    fetch('http://localhost:5000/book/set-end-date', {
      method: 'POST',
      mode: 'cors', // no-cors, cors, *same-origin
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        id: this.props.match.params.bookId,
        end: this.state.endDate,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch(error => console.error(error))
  }

  handleSubmitGenres(event) {
    event.preventDefault()
    fetch('http://localhost:5000/set-genres', {
      method: 'POST',
      mode: 'cors', // no-cors, cors, *same-origin
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        id: this.props.match.params.bookId,
        genres: this.state.selectedGenres,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch(error => console.error(error))
  }

  getGenres() {
    fetch('http://localhost:5000/get-genres', {
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
        this.setState({ genres: data })
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

  componentDidMount() {
    this.getGenres()
    this.getTitle()
  }

  render() {
    let availableGenres = this.state.genres.filter(genre => {
      for (let i = 0; i < this.state.selectedGenres.length; i++) {
        if (this.state.selectedGenres[i].text === genre.text) {
          return false
        }
      }
      return true
    })

    return (
      <Container>
        <div className="BookForm">
          <h2>Add info for {this.state.title}</h2>
          <br />
          <div className="forms">
            <Row>
              <Form onSubmit={this.handleSubmitGenres}>
                <Col>
                  <Form.Label>Select Book Genre(s)</Form.Label>
                  <Form.Group controlId="filteredMultiAdd">
                    <FilteredMultiSelect
                      buttonText="Add"
                      showFilter={true}
                      placeholder="type to filter"
                      size="6"
                      onChange={this.handleSelect}
                      options={availableGenres}
                      selectedOptions={this.selectedGenres}
                    />
                  </Form.Group>
                  <Form.Group controlId="filteredMultiRemove">
                    <FilteredMultiSelect
                      buttonText="Remove"
                      onChange={this.handleDeselect}
                      options={this.state.selectedGenres}
                      showFilter={false}
                      size="6"
                    />
                  </Form.Group>
                </Col>
                <Button className="multiSelectBtn" type="submit" size="lg">
                  Submit
                </Button>
                <br />
              </Form>
              <Col>
                <Form onSubmit={this.handleSubmitStartDate}>
                  <Row>
                    <Form.Label>Start date:</Form.Label>
                  </Row>
                  <Row>
                    <input
                      type="date"
                      name="start"
                      value={this.state.startDate}
                      onChange={this.handleStartDateChange}
                    />
                    <Button className="btnDate" type="submit">
                      Submit
                    </Button>
                  </Row>
                  <br />
                </Form>
                <Form onSubmit={this.handleSubmitEndDate}>
                  <Row>
                    <Form.Label>End date:</Form.Label>
                  </Row>
                  <Row>
                    <input
                      type="date"
                      name="end"
                      value={this.state.endDate}
                      onChange={this.handleEndDateChange}
                    />
                    <Button className="btnDate" type="submit">
                      Submit
                    </Button>
                  </Row>
                </Form>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    )
  }
}
export default BookForms
