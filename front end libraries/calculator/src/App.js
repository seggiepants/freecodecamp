import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.buttons = {
      buttons: [
        {
          id: "zero",
          label: "0",
          value: 0,
          type: "digit",
        },
        {
          id: "one",
          label: "1",
          value: 1,
          type: "digit",
        },
        {
          id: "two",
          label: "2",
          value: 2,
          type: "digit",
        },
        {
          id: "three",
          label: "3",
          value: 3,
          type: "digit",
        },
        {
          id: "four",
          label: "4",          
          value: 4,
          type: "digit",
        },
        {
          id: "five",
          label: "5",
          value: 5,
          type: "digit",
        },
        {
          id: "six", 
          label: "6",
          value: 6,
          type: "digit",
        },
        {
          id: "seven",
          label: "7",
          value: 7,
          type: "digit",
        },
        {
          id: "eight",
          label: "8",
          value: 8,
          type: "digit",
        },
        {
          id: "nine",
          label: "9",
          value: 9,
          type: "digit",
        },
        {
          id: "add",
          label: "+",
          type: "operator",
        },
        {
          id: "subtract",
          label: "-",
          type: "operator",
        },
        {
          id: "multiply",
          label: "\u00D7", // &times;
          type: "operator",
        },
        {
          id: "divide",
          label: "\u00F7", // &divide;
          type: "operator",
        },
        {
          id: "decimal",
          label: ".",
          type: "operator",
        },
        {
          id: "equals",
          label: "=",
          type: "operator",
        },
        {
          id: "clear",
          label: "C",
          type: "operator",
        },
      ],
    }
  }

  render() {
    //const digits = this.buttons.filter(button => button["type"] === "digit");
    console.log(this.buttons.digits);
    console.log(this.buttons.operators);
    let buttons = [];
    for(let i = 0; i < this.buttons.buttons.length; i++) {
      let button = this.buttons.buttons[i];
      let buttonClass = "btn btn-danger";
      if (button.type === "operator") {
        buttonClass = "btn btn-info";
      } else if (button.type === "digit") {
        buttonClass = "btn btn-success";
      }

      let buttonStyle = {
        gridArea: button.id,
      };
      console.log(buttonStyle);

      buttons.push(<button id={button.id} key={button.id} className={buttonClass} style={buttonStyle}>
        {button.label}      
      </button>);
    }

    return (
      <div id="root">
        <div className="calculator">
          <div id="display">0.0</div>
          <div id="title">Tiny Calculator</div>
          {buttons}
        </div>
      </div>
    );
  }
}

export default App;
