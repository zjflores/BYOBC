import React from 'react'
import AddBook from './AddBook'
import Book from './Book'
import { Col, Row, Container } from 'react-bootstrap'

class BookList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      books: [],
    }
    this.getUserId = this.getUserId.bind(this)
    this.getBooks = this.getBooks.bind(this)
    this.onBookDelete = this.onBookDelete.bind(this)
    this.onBookAdd = this.onBookAdd.bind(this)
    this.onBookUpdate = this.onBookUpdate.bind(this)
  }

  onBookDelete(bookId) {
    const updatedBooks = this.state.books.filter(book => {
      return book.id !== bookId
    })
    this.setState({ books: updatedBooks })
  }

  onBookAdd(title, author, bookId) {
    const newBooks = this.state.books
    newBooks.push({ title: title, author: author, id: bookId })
    this.setState({ books: newBooks })
  }

  onBookUpdate(oldBookId, newBookId, newTitle, newAuthor) {
    // Object.assign({}, this.state.books)
    const updatedBooks = this.state.books.filter(book => {
      return book.id !== oldBookId
    })
    updatedBooks.push({ title: newTitle, author: newAuthor, id: newBookId })
    this.setState({ books: updatedBooks })
  }

  getUserId() {
    fetch('http://localhost:5000/get-userid', {
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
        this.setState({ userId: data })
      })
      .catch(error => console.error(error))
  }

  getBooks() {
    fetch('http://localhost:5000/get-your-books', {
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
        this.setState({ books: data })
      })
      .catch(error => console.error(error))
  }
  componentDidMount() {
    this.getBooks()
    this.getUserId()
  }

  render() {
    return (
      <Container className="BookList">
        <Row>
          <Col sm={8}>
            <h2>Your Shelf</h2>
            {this.state.books.map(book => {
              return (
                <Book
                  key={book.id}
                  title={book.title}
                  author={book.author}
                  bookId={book.id}
                  userId={this.state.userId}
                  onBookDelete={this.onBookDelete}
                  onBookUpdate={this.onBookUpdate}
                />
              )
            })}
          </Col>
          <Col sm={4}>
            <AddBook onBookAdd={this.onBookAdd} />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default BookList
