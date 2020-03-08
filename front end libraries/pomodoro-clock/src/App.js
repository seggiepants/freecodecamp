import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      default: {
        break_length: 5,
        session_length: 25,
      },
      break_length: 5,
      session_length: 25,
      time_left: 0,
      time_left_label: '00:00',
    };

    this.formatTimeLeft = this.formatTimeLeft.bind(this);
    this.onBreakDecrement = this.onBreakDecrement.bind(this);
    this.onBreakIncrement = this.onBreakIncrement.bind(this);
    this.onSessionDecrement = this.onSessionDecrement.bind(this);
    this.onSessionIncrement = this.onSessionIncrement.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  formatTimeLeft(seconds_remaining) {
    let seconds = seconds_remaining % 60;
    let minutes = (seconds_remaining - seconds) / 60;
    return ('00' + minutes).substr(-2, 2) + ':' + ('00' + seconds).substr(-2, 2);
  }

  onBreakDecrement() {
    this.setState(Object.assign(this.state, {break_length: Math.max(1, this.state.break_length - 1)}));
  }

  onBreakIncrement() {
    this.setState(Object.assign(this.state, {break_length: Math.min(60, this.state.break_length + 1)}));
  }

  onSessionDecrement() {
    this.setState(Object.assign(this.state, {session_length: Math.max(1, this.state.session_length - 1)}));    
  }
  
  onSessionIncrement() {
    this.setState(Object.assign(this.state, {session_length: Math.min(60, this.state.session_length + 1)}));
  }

  onReset() {
    let timeLeft = 0; //this.state.default.session_length * 60;
    this.setState(Object.assign(this.state, {
      break_length: this.state.default.break_length,
      session_length: this.state.default.session_length,
      time_left: timeLeft,
      time_left_label: this.formatTimeLeft(timeLeft),
    }));
  }

  render () {
    return (
      <div className="App">
        <div id="break-label">Break</div>
        <button id="break-decrement" onClick={this.onBreakDecrement}>-</button><div id="break-length">{this.state.break_length}</div><button id="break-increment" onClick={this.onBreakIncrement}>+</button>
        <div id="session-label">Session</div>
        <button id="session-decrement" onClick={this.onSessionDecrement}>-</button><div id="session-length">{this.state.session_length}</div><button id="session-increment" onClick={this.onSessionIncrement}>+</button>
        <div id="timer-label">Timer</div>
        <div id="time-left">{this.state.time_left_label}</div>
        <button id="start_stop">Start</button>
        <button id="reset" onClick={this.onReset}>Reset</button>
        Hello, World!
      </div>
    );
  }
}

export default App;
