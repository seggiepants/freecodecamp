import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { quotes: [], author: "loading...", text: "loading...", image: "" };
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
      const newState = Object.assign({}, { author: this.state.author, text: this.state.text, image: this.state.image}, json);
      this.setState(newState);
      this.nextQuote(newState);
	  //console.log(newState);
	  //console.log(this.state);
    })
  } 

  randomQuote() {
    const oldAuthor = this.state.author;
    const oldText = this.state.text;
    
    if (this.state.quotes.length > 0) {
      let index;
      let quote;
      do {
        index = Math.floor(Math.random() * this.state.quotes.length);      
        quote = this.state.quotes[index];
      } while (quote.author === oldAuthor || quote.text === oldText);

      let newState = Object.assign({}, {author: quote.author, text: quote.text, image: quote.image}, this.state.quotes );
      this.setState(newState);
    }
  }
  
  nextQuote(pendingState)
  {
	const oldAuthor = this.state.author;
    const oldText = this.state.text;
    
    if (pendingState.quotes.length > 0) {
      let index;
      let quote;
      do {
        index = Math.floor(Math.random() * pendingState.quotes.length);      
        quote = pendingState.quotes[index];
      } while (quote.author === oldAuthor || quote.text === oldText);

      let newState = Object.assign({}, {author: quote.author, text: quote.text, image: quote.image}, pendingState.quotes );
      this.setState(newState);
    }
  }

  tweetQuote() {
    const url = `https://x.com/intent/tweet?hashtags=quotes&related=freecodecamp&text="${encodeURIComponent(this.state.text)}" ${encodeURIComponent(this.state.author)}`;
    window.open(url);
  }

  render () {
    const twitter_url = "https://x.com/intent/tweet?hashtags=quotes&related=freecodecamp&text="
	if (this.state.text == "loading..." && this.state.quotes.length > 0)
	{
		this.randomQuote();
	}
    return (
      <div>
        <div id="quote-box">
          <div className="row">
          <span><img alt="" src="img/logo.svg" className = "red-dwarf-logo" /><span id="app-title"><h1>Red Dwarf Quote Machine</h1></span>
          <img alt="" src="img/logo.svg" className = "red-dwarf-logo" /></span>
          </div>
          <div id="text" className="row">
            {this.state.text}
          </div>              
          <div id="author-frame" className="row">
            <img src={this.state.image} alt={this.state.author} />          
          </div>
          <div id="author" className="row">
              {this.state.author}
          </div>
          <div id="nav-frame" className="row">
            <button id="new-quote" onClick={this.randomQuote} className="btn btn-primary quote-button">New Quote</button>
            <a href={twitter_url + encodeURIComponent("\"" + this.state.text + "\" " + this.state.author)} id="tweet-quote" className="btn btn-info quote-button"><i className="fa fa-twitter"></i>Twitter</a>
          </div>
        </div>
      </div>
    );
  }

}


export default App;
