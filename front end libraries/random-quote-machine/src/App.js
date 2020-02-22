import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { quotes: [], author: "loading...", text: "loading..." };
    this.loadQuotes = this.loadQuotes.bind(this);
    this.randomQuote = this.randomQuote.bind(this);
    this.tweetQuote = this.tweetQuote.bind(this);
  }

  componentDidMount() {
    this.loadQuotes();
  }

  loadQuotes() {
    console.log("loadQuotes");
    fetch('./red_dwarf.json')
    .then(response => response.json())
    .then(json => {
      const newState = Object.assign({}, { author: this.state.author, text: this.state.text}, json);
      this.setState(newState);
      this.randomQuote();
    })
  } 

  randomQuote() {
    console.log(this);
    const oldAuthor = this.state.author;
    const oldText = this.state.text;
    if (this.state.quotes.length > 0) {
      let index;
      let quote;
      do {
        index = Math.floor(Math.random() * this.state.quotes.length);      
        quote = this.state.quotes[index];
      } while (quote.author === oldAuthor || quote.text === oldText);

      let newState = Object.assign({}, {author: quote.author, text: quote.text}, this.state.quotes );
      console.log(newState);
      this.setState(newState);
    }
  }

  tweetQuote() {
    const url = `https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text="${encodeURIComponent(this.state.text)}" ${encodeURIComponent(this.state.author)}`;
    window.open(url);
  }

  render () {
    const twitter_url = "https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text="
    return (
      <div className="App">
        <div id="quote-box" className="App-header">
          Red-Dwarf Quote Machine
          <div id="text">
            Quote: {this.state.text}
          </div>
          <div id="author">
            Author: {this.state.author}
          </div>
          <button id="new-quote" onClick={this.randomQuote}>New Quote</button>
          <a href={twitter_url + encodeURIComponent("\"" + this.state.text + "\" " + this.state.author)} id="tweet-quote">Twitter</a>
        </div>
      </div>
    );
  }

}


export default App;
