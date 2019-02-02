import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
// import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import './App.css'
import './Base.css'
import Home from './Home'
import BookList from './BookList'
import BookInfo from './BookInfo'
import Login from './Login'
import Register from './Register'
import UserList from './UserList'
import UserBooks from './UserBooks'
import BookForms from './BookForms'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
    }
    this.onLogin = this.onLogin.bind(this)
    this.onLogout = this.onLogout.bind(this)
    this.renderLogin = this.renderLogin.bind(this)
    this.renderRegister = this.renderRegister.bind(this)
    this.renderHome = this.renderHome.bind(this)
  }
  onLogin() {
    this.setState({ isLoggedIn: true })
  }
  onLogout() {
    this.setState({ isLoggedIn: false })
  }
  renderLogin() {
    return <Login onLogin={this.onLogin} isLoggedIn={this.state.isLoggedIn} />
  }

  renderRegister() {
    return (
      <Register onLogin={this.onLogin} isLoggedIn={this.state.isLoggedIn} />
    )
  }
  renderHome() {
    return <Home onLogout={this.onLogout} isLoggedIn={this.state.isLoggedIn} />
  }
  render() {
    return (
      <Router>
        <div className="App">
          <div className="App container">
            <Route path="/" component={this.renderHome} />
            <Route path="/register" component={this.renderRegister} />
            <Route path="/login" component={this.renderLogin} />
            <Route path="/books" component={BookList} />
            <Route exact path="/user/:id/book/:bookId" component={BookInfo} />
            <Route path="/user/:id/book/:bookId/update" component={BookForms} />
            <Route path="/users" component={UserList} />
            <Route path="/user/:id/books" component={UserBooks} />
          </div>
        </div>
      </Router>
    )
  }
}

export default App
