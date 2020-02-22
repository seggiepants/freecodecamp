import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <div id="quote-box" className="App-header">
        Red-Dwarf Quote Machine
        <div id="text">
          Text
        </div>
        <div id="author">
          Author
        </div>
        <button id="new-quote">New Quote</button>
        <a href="#" id="tweet-quote">Twitter</a>
      </div>
    </div>
  );
}

export default App;
