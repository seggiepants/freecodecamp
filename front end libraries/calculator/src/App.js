import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.buttons = {
      digits: [
        {
          id: "zero",
          label: "0",
          value: 0,
        },
        {
          id: "one",
          label: "1",
          value: 1,
        },
        {
          id: "two",
          label: "2",
          value: 2,
        },
        {
          id: "three",
          label: "3",
          value: 3,
        },
        {
          id: "four",
          label: "4",
          value: 4,
        },
        {
          id: "five",
          label: "5",
          value: 5,
        },
        {
          id: "six", 
          label: "6",
          value: 6,
        },
        {
          id: "seven",
          label: "7",
          value: 7,
        },
        {
          id: "eight",
          label: "8",
          value: 8,
        },
        {
          id: "nine",
          label: "9",
          value: 9,
        },
      ],
      operators: [
        {
          id: "add",
          label: "+",
        },
        {
          id: "subtract",
          label: "-",
        },
        {
          id: "multiply",
          label: "X",
        },
        {
          id: "divide",
          label: "/",
        },
        {
          id: "decimal",
          label: ".",
        },
        {
          id: "equals",
          label: "=",
        },
        {
          id: "clear",
          label: "C",
        },
      ],
    }
  }

  render() {
    //const digits = this.buttons.filter(button => button["type"] === "digit");
    console.log(this.buttons.digits);
    console.log(this.buttons.operators);
    let digits = [];
    for(let i = 0; i < this.buttons.digits.length; i++) {
      let digit = this.buttons.digits[i];
      digits.push(<button id={digit.id} key={digit.id}>
        {digit.label}      
      </button>);
    }

    let operators = [];
    for(let i = 0; i < this.buttons.operators.length; i++) {
      let operator = this.buttons.operators[i];
      operators.push(<button id={operator.id} key={operator.id}>
        {operator.label}      
      </button>);
    }

    return (
      <div id="root">
        <div id="display">.</div>
        {digits}
        {operators}
      </div>
    );
  }
}

export default App;
