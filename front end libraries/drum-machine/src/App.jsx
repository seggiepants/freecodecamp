import React from 'react';
import './App.css';

class App extends React.Component {  
  constructor(props) {
    super(props);    
    this.drums = {
      "Q": {
        id: "btnAlert",
        label: "Alert",
        ogg: "alert.ogg",
        mp3: "alert.mp3",
      },
      "W": {
        id: "btnCoin",
        label: "Coin",
        ogg: "coin.ogg",
        mp3: "coin.mp3",
      },
      "E": {
        id: "btnExplosion",
        label: "Explosion",
        ogg: "explosion.ogg",
        mp3: "explosion.mp3",
      },
      "A": {
        id: "btnHit",
        label: "Hit",
        ogg: "hit.ogg",
        mp3: "hit.mp3",
      },
      "S": {
        id: "btnJump",
        label: "Jump",
        ogg: "jump.ogg",
        mp3: "jump.mp3",
      },
      "D": {
        id: "btnLaser",
        label: "Laser",
        ogg: "laser.ogg",
        mp3: "laser.mp3",
      },
      "Z": {
        id: "btnPowerup",
        label: "Powerup",
        ogg: "powerup.ogg",
        mp3: "powerup.mp3",
      },
      "X": {
        id: "btnSelect",
        label: "Select",
        ogg: "select.ogg",
        mp3: "select.mp3",
      },
      "C": {
        id: "btnStep",
        label: "Step",
        ogg: "step.ogg",
        mp3: "step.mp3",
      },
    }

    this.playAudio = this.playAudio.bind(this);
    this.handleKey = this.handleKey.bind(this);

  }

  componentDidMount() {    
    document.addEventListener("keydown", this.handleKey);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKey);
  }

  handleKey(e) {
    let key = e.key.toUpperCase();
    if (this.drums.hasOwnProperty(key)) {
      this.playAudio(key);
    }
  }

  playAudio(id) {
    let audio = document.getElementById(id);
    audio.play();
    if (this.drums.hasOwnProperty(id)) {
      document.getElementById("display").innerText = this.drums[id].label;
    } else {
      document.getElementById("display").innerText = "Unknown";
    }
  }

  render() {
    // const audio_root = "https://github.com/seggiepants/freecodecamp/raw/master/front%20end%20libraries/drum-machine/public/audio/";
    const audio_root = "audio/";
    const keys = Object.keys(this.drums);
    let buttons = [];
    for(let i = 0; i < keys.length; i++) {
      let key = keys[i];
      buttons.push(<button id={this.drums[key].id} key={this.drums[key].id} className="drum-pad btn btn-info col-sm-3" onClick={() => this.playAudio(key)}>
        {key}
        <audio id={key} className="clip" src={audio_root + this.drums[key].ogg}>
          <source src={audio_root + this.drums[key].mp3} />
          <source src={audio_root + this.drums[key].ogg} />
        </audio>
      </button>);
    }
    return (
      <div id="drum-machine" className="App">
        <div id="display" className="jumbotron">- - -</div>
        {buttons}
        <div id="fade_1" className="col-sm-3">&nbsp;</div>
        <div id="title" className="well col-sm-6">8-BIT Sound Board</div>
        <div id="fade_2" className="col-sm-3">&nbsp;</div>
      </div>
    );
  }
}

export default App;
