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
    this.tokensToString = this.tokensToString.bind(this);
    this.updateTokens = this.updateTokens.bind(this);    
  }

  componentDidMount() {    
    document.addEventListener("keydown", this.handleKey);
    this.updateTokens(this.state.tokens);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKey);
  }

  handleKey(e) {
    let key = e.key.toUpperCase();
    let keys = Object.keys(this.buttons);
    for(let i = 0; i < keys.length; i++) {
      if (this.buttons[keys[i]].key === key) {
        this.onClick(this.buttons[keys[i]]);
        break;
      }
    }
  }

  onClick(e) {
    let btn;
    // Did we get called by a keystroke or a button click.
    if (e.type == "click") {
      // Button click
      if (this.buttons.hasOwnProperty(e.target.id)) {
        btn = this.buttons[e.target.id];
      } else {
        btn = {};
      }
    } else {
      // Keystroke
      btn = e;
    }
    let tokens = [...this.state.tokens];

    if (tokens.length === 1 && tokens[0].type === "error") {
      tokens = [];
    }
    let lastToken = {};
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
        tokens.push({ "type": "number", "value": btn.key, "label": btn.label});
      } else if (lastToken.type === "number") {
        if ((btn.key !== ".") || (lastToken.value.indexOf(".") === -1)) {
          // Not the decimal point, or we haven't used the decimal point yet.
          if (btn.key !== "0" || lastToken.value !== "0") {
            lastToken.value = lastToken.value + btn.key;
          }
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
          tokens.push({ "type": "number", "value": btn.key, "label": btn.label});
        } else if (lastToken.type === "operator") {
          // Replace the operator if two in a row are entered.
          lastToken.value = btn.key;
          lastToken.label = btn.label;
        } else {
          // Add an operator.
          tokens.push({ "type": "operator", "value": btn.key, "label": btn.label});
        }
      } else if (btn.key === "C") {
        tokens = [];
      } else if (btn.key === "=") {
        // Compute the value then create a new token of just that value
        let newValue = this.tokensCalculate(tokens);
        if (newValue === "ERR") {
          tokens = [{ "type": "error", "value": newValue, "label": newValue}]          
        } else {
          tokens = [{ "type": "number", "value": newValue, "label": newValue}]
        }
      } else {
        if (tokens.length > 0) { // Can't start with an operator
          if (lastToken.type === "number" && lastToken.value !== "-") { // Don't allow consecutive operators. Treat number="-" as minus operator.
            tokens.push({ "type": "operator", "value": btn.key, "label": btn.label});
          } else { // instead, replace them.
            lastToken = tokens.pop();
            if (tokens.length > 0) {
              if (tokens[tokens.length - 1].type === "operator") {
                // If we had two tokens in a row pop off one more.
                // Should only happen if we had a number = "-" between operators (I think).
                lastToken = tokens.pop();
              }
            }
            tokens.push({"type": "operator", "value": btn.key, "label": btn.label});
          }
        }
      }
    }
    this.updateTokens(tokens);    
  }

  tokensCalculate(tokens) {
    let parseTokens = [...tokens];
    let i = 0
    while (i < parseTokens.length) {
      let expr = parseTokens.slice(i, i + 3);
      if (expr.length === 3) {
        if ((expr[0].type === "number") && (expr[1].type === "operator") && (expr[2].type === "number")) {
          let operator = expr[1].value;
          let newValue = 0;
          if (operator === "*" || operator === "/") {
            if (operator === "*") {
              newValue = parseFloat(expr[0].value) * parseFloat(expr[2].value);
            } else if (operator === "/") {
              newValue = parseFloat(expr[0].value) / parseFloat(expr[2].value);
            }
            let start = [];
            if (i > 0) {
              start = parseTokens.slice(0, i);
            }
            let middle = {"type": "number", "value": newValue.toString(), "label": newValue.toString() };
            let end = parseTokens.slice(i + 3, parseTokens.length);
            parseTokens = start.concat(middle, end);
            i--;
          } 
        }
      }
      i++;
    }

    i = 0
    while (i < parseTokens.length) {
      let expr = parseTokens.slice(i, i + 3);
      if (expr.length === 3) {
        if ((expr[0].type === "number") && (expr[1].type === "operator") && (expr[2].type === "number")) {
          let operator = expr[1].value;
          let newValue = 0;
          if (operator === "+" || operator === "-") {
            if (operator === "+") {
              newValue = parseFloat(expr[0].value) + parseFloat(expr[2].value);
            } else if (operator === "-") {
              newValue = parseFloat(expr[0].value) - parseFloat(expr[2].value);
            }
            // I should probably use splice instead.
            let start = [];
            if (i > 0) {
              start = parseTokens.slice(0, i);
            }
            let middle = {"type": "number", "value": newValue.toString(), "label": newValue.toString() };
            let end = parseTokens.slice(i + 3, parseTokens.length);
            parseTokens = start.concat(middle, end);
          } else {
            i++;
          } 
        } else {
          i++;
        }
      } else {
        i++;
      }
    }
    if (parseTokens.length === 1) {
      return parseTokens[0].value;
    } else if (parseTokens.length === 0) {
      return "0";
    } else {
      return "ERR";
    }
  }

  tokensToString(tokens) {
    if (tokens.length > 0) {
      return tokens.map((token) => {
        if (token.type !== "operator") {
          return token.value
        } else {
          return ' ' + token.label + ' ';
        }
      }).join('');
    } else {
      return "0";
    }
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
      guiButtons.push(<button id={keys[i]} key={keys[i]} className={buttonClass} style={buttonStyle} onClick={this.onClick}>
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
