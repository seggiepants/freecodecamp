import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokens: [],
      display: '',
    };
    this.buttons = {
      "zero": {
          label: "0",
          type: "digit",
          key: "0",
      },
      "one": {
          label: "1",
          type: "digit",
          key: "1",
      },
      "two": {
        label: "2",
        type: "digit",
        key: "2",
      },
      "three": {
        label: "3",
        type: "digit",
        key: "3",
      },
      "four": {
        label: "4",          
        type: "digit",
        key: "4",
      },
      "five": {
        label: "5",
        type: "digit",
        key: "5",
      },
      "six": {
        label: "6",
        type: "digit",
        key: "6",
      },
      "seven": {
        label: "7",
        type: "digit",
        key: "7",
      },
      "eight": {
        label: "8",
        type: "digit",
        key: "8",
      },
      "nine": {
        label: "9",
        type: "digit",
        key: "9",
      },
      "add": {
        label: "+",
        type: "operator",
        key: "+",
      },
      "subtract": {
        label: "-",
        type: "operator",
        key: "-",
      },
      "multiply": {
        label: "\u00D7", // &times;
        type: "operator",
        key: "*",
      },
      "divide": {
        label: "\u00F7", // &divide;
        type: "operator",
        key: "/",
      },
      "decimal": {
        label: ".",
        type: "digit",
        key: ".",
      },
      "equals": {
        label: "=",
        type: "operator",
        key: "=",
      },
      "clear": {
        label: "C",
        type: "operator",
        key: "C",
      },
    }

    this.handleKey = this.handleKey.bind(this);
    this.onClick = this.onClick.bind(this);
    this.tokensToString = this.tokensToString(this);
    this.updateTokens = this.updateTokens.bind(this);
  }

  componentDidMount() {    
    document.addEventListener("keydown", this.handleKey);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKey);
  }

  handleKey(e) {
    let key = e.key.toUpperCase();
    let keys = Object.keys(this.buttons);
    for(let i = 0; i < keys.length; i++) {
      if (this.buttons[keys[i]].key === key) {
        console.log(this.buttons[keys[i]]);
        this.onClick(this.buttons[keys[i]]);
        break;
      }
    }
  }

  onClick(btn) {
    let tokens = [...this.state.tokens];
    let lastToken = {'type': 'error', 'value': 'ERR'};
    if (tokens.length > 0) { 
      lastToken = tokens[tokens.length - 1];
    }
    let newToken = false;
    if (btn.type === "digit") {
      if (tokens.length === 0) {
        newToken = true;
      } else if (lastToken.type !== 'number') {
          newToken = true;
      }

      if (newToken) {
        tokens.push({ "type": "digit", "value": btn.key});
      } else if (lastToken.type === "number") {
        if ((btn.key !== ".") || (lastToken.value.indexOf(".") !== -1)) {
          // Not the decimal point, or we haven't used the decimal point yet.
          lastToken.value = lastToken.value + btn.key;
        }
      }
    } else if (btn.type === "operator") { 
      // Special case for the minus sign.If we are on the very first token or 
      // the last token was an operator then start a new token with a minus sign.
      // otherwise it is a subtract operator.
      if (btn.key === "-") {
        let newDigit = false;
        if (tokens.length === 0) {
          newDigit = true;
        } else if (lastToken.type !== "number") {
          newDigit = true;
        }

        if (newDigit) {
          tokens.push({ "type": "number", "value": btn.key});
        } else {
          tokens.push({ "type": "operator", "value": btn.key});
        }
      } else {
        if (tokens.length > 0) { // Can't start with an operator
          if (lastToken.type === "number") { // Don't allow consecutive operators.
            tokens.push({ "type": "operator", "value": btn.key});
          }
        }
      }
    }
    this.updateTokens(tokens);    
  }

  tokensToString(tokens) {
    /*
    console.log(this.state.tokens);
    console.log(tokens);
    let values = tokens.map(token => token.value);
    console.log(values);
    if (tokens.length > 0) {
      return tokens.map((token) => token.value).join(' ');
    } else {
      return [];
    }
    */
   return "0.";
  }

  updateTokens(tokens) { 
    this.setState({ "tokens": tokens, "display": this.tokensToString(tokens) });
  }

  render() {
    let guiButtons = [];
    let keys = Object.keys(this.buttons);
    for(let i = 0; i < keys.length; i++) {
      let button = this.buttons[keys[i]];
      let buttonClass = "btn btn-danger";
      if (button.type === "operator") {
        buttonClass = "btn btn-info";
      } else if (button.type === "digit") {
        buttonClass = "btn btn-success";
      }

      let buttonStyle = {
        gridArea: keys[i],
      };
      guiButtons.push(<button id={keys[i]} key={keys[i]} className={buttonClass} style={buttonStyle}>
        {button.label}      
      </button>);
    }

    return (
      <div id="root">
        <div className="calculator">
          <div id="display">{this.state.display}</div>
          <div id="title">Tiny Calculator</div>
          {guiButtons}
        </div>
      </div>
    );
  }
}

export default App;
