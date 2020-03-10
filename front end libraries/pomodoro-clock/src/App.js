import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    let session_length = 25;
    let break_length = 5;
    this.state = {
      default: {
        break_length: break_length,
        session_length: session_length,
      },
      break_length: break_length,
      session_length: session_length,
      time_left: 0,
      time_left_label: this.formatTimeLeft(0),
      is_running: false,
      timer: 0,
      mode: "Session",
    };

    this.beep = this.beep.bind(this);
    this.formatTimeLeft = this.formatTimeLeft.bind(this);
    this.getStartStopLabel = this.getStartStopLabel.bind(this);
    this.onBreakDecrement = this.onBreakDecrement.bind(this);
    this.onBreakIncrement = this.onBreakIncrement.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onSessionDecrement = this.onSessionDecrement.bind(this);
    this.onSessionIncrement = this.onSessionIncrement.bind(this);
    this.onStartStop = this.onStartStop.bind(this);
    this.onTick = this.onTick.bind(this);
  }

  beep() {
    document.getElementById("beep").play();
  }

  formatTimeLeft(seconds_remaining) {
    let seconds = seconds_remaining % 60;
    let minutes = (seconds_remaining - seconds) / 60;
    return ('00' + minutes).substr(-2, 2) + ':' + ('00' + seconds).substr(-2, 2);
  }

  getStartStopLabel() {
    if (this.state.is_running) {
      return "Pause";
    } else {
      return "Start";
    }
  }

  onBreakDecrement() {
    this.setState(Object.assign(this.state, {break_length: Math.max(1, this.state.break_length - 1)}));
  }

  onBreakIncrement() {
    this.setState(Object.assign(this.state, {break_length: Math.min(60, this.state.break_length + 1)}));
  }

  onReset() {

    let audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;

    let time_left = this.state.default.session_length * 60; // 0;
    if (this.state.is_running === true) {
      console.log("Clear Timer");
      clearInterval(this.state.timer);
    }

    this.setState(Object.assign(this.state, {
      break_length: this.state.default.break_length,
      session_length: this.state.default.session_length,
      time_left: time_left,
      time_left_label: this.formatTimeLeft(time_left),
      is_running: false,
      timer: 0, 
      mode: "Session",
    }));
  }

  onSessionDecrement() {
    this.setState(Object.assign(this.state, {session_length: Math.max(1, this.state.session_length - 1)}));    
  }
  
  onSessionIncrement() {
    this.setState(Object.assign(this.state, {session_length: Math.min(60, this.state.session_length + 1)}));
  }

  onStartStop() {    
    
    if (this.state.is_running) {
      // Stop the clock.
      console.log("Stop");
      clearInterval(this.state.timer);
      this.setState(Object.assign(this.state, {
        is_running: false,
        timer: 0,
      }));
    } else {
      // Start the clock.
      console.log("Start");
      let handle = setInterval(this.onTick, 1000);
      let time_left = this.state.time_left;
      if (time_left === 0) {
        time_left = this.state.session_length * 60;
      }
      this.setState(Object.assign(this.state, {
        time_left: time_left,
        is_running: true,
        timer: handle,
      }));
    }
  }

  onTick() {
    let time_left = this.state.time_left - 1;
    let mode = this.state.mode;
    if (time_left < 0) {
      document.getElementById("beep").play();
      if (mode === "Session") {
        time_left = this.state.break_length * 60;
        mode = "Break";
      } else {
        time_left = this.state.session_length * 60;
        mode = "Session";
        console.log(`session ${time_left} length: ${this.state.session_length}`);
      }
    } 
    if (this.state.is_running) {
      this.setState(Object.assign(this.state, {
        time_left: time_left,
        time_left_label: this.formatTimeLeft(time_left),
        mode: mode,
      }));
    }
  }
  render () {
    // const audio_root = "https://github.com/seggiepants/freecodecamp/raw/master/front%20end%20libraries/pomodoro-clock/public/audio/";
    const audio_root = "audio/";

    return (
      <div className="App">
        <div id="container">
          <div id="title">Pomodoro Clock</div>
          <div id="break-label">Break</div>
          <button className="btn btn-info" id="break-decrement" onClick={this.onBreakDecrement}>-</button>
          <div id="break-length">{this.state.break_length}</div>
          <button className="btn btn-info" id="break-increment" onClick={this.onBreakIncrement}>+</button>
          <div id="session-label">Session</div>
          <button id="session-decrement" className="btn btn-info" onClick={this.onSessionDecrement}>-</button>
          <div id="session-length">{this.state.session_length}</div>
          <button id="session-increment" className="btn btn-info" onClick={this.onSessionIncrement}>+</button>
          <div id="timer-label">{this.state.mode}</div>
          <div id="time-left">{this.state.time_left_label}</div>
          <button className="btn btn-success" id="start_stop" onClick={this.onStartStop}>{this.getStartStopLabel()}</button>
          <button className="btn btn-danger" id="reset" onClick={this.onReset}>Reset</button>
        </div>
        <audio id="beep" className="clip" src={audio_root + "ding.mp3"}>
          <source src={audio_root + "ding.mp3"} />
          <source src={audio_root + "ding.ogg"} />
        </audio>
      </div>
    );
  }
}

export default App;
