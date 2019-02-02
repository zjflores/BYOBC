import React, { Component } from 'react'
import NavBar from './NavBar'
import './Base.css'
import { Jumbotron } from 'react-bootstrap'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = { quote: '' }
  }

  getQuote = () => {
    fetch('http://localhost:5000')
      .then(response => response.json())
      .then(data => this.setState({ quote: data.quote }))
  }

  componentDidMount() {
    this.getQuote()
  }

  render() {
    return (
      <div className="imgBackground">
        <Jumbotron className="Home container-fluid" />
        <header>
          <div className="header">
            <NavBar
              isLoggedIn={this.props.isLoggedIn}
              onLogout={this.props.onLogout}
            />
            <div className="Cover">
              <h1 className="Title">Build Your Own Book Club</h1>
              <p className="quote">{this.state.quote}</p>
            </div>
          </div>
        </header>
      </div>
    )
  }
}

export default Home
