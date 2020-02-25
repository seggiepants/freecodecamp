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

      let newState = Object.assign({}, {author: quote.author, text: quote.text, image: quote.image}, this.state.quotes );
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
      <div>
        <div id="quote-box" className="row">
          Red-Dwarf Quote Machine
          <div id="frame">
            <div className="row">
              <div id="quote-frame">
                <div id="text">
                  {this.state.text}
                </div>
                
              </div>
              <div id="author-frame" className="col-lg-5 col-xs-10">
                <img src={this.state.image} alt={this.state.author} />          
                <div id="author">
                  {this.state.author}
                </div>
              </div>
            </div>
          </div>
          <div id="nav-frame" className="row">
            <button id="new-quote" onClick={this.randomQuote} className="btn btn-primary">New Quote</button>
            <a href={twitter_url + encodeURIComponent("\"" + this.state.text + "\" " + this.state.author)} id="tweet-quote" className="btn btn-info "><i className="fa fa-twitter"></i>Twitter</a>
          </div>
        </div>
      </div>
    );
  }

}


export default App;
