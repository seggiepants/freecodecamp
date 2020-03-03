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
    console.log(Object.keys(this.drums));

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
      buttons.push(<button id={this.drums[key].id} className="drum-pad" onClick={() => this.playAudio(key)}>
        {key}
        <audio id={key} className="clip" src={audio_root + this.drums[key].ogg}>
          <source src={audio_root + this.drums[key].mp3} />
          <source src={audio_root + this.drums[key].ogg} />
        </audio>
      </button>);
    }
    /*
        <button id="btnAlert" className="drum-pad" onClick={() => this.playAudio("Q")}>Q<audio id="Q" className="clip" src="audio/alert.ogg"><source src="audio/alert.mp3" /><source src="audio/alert.ogg" /></audio></button>
        <button id="btnCoin" className="drum-pad" onClick={() => this.playAudio("W")}>W<audio id="W" className="clip" src="audio/coin.ogg"><source src="audio/coin.mp3" /><source src="audio/coin.ogg" /></audio></button>
        <button id="btnExplosion" className="drum-pad" onClick={() => this.playAudio("E")}>E<audio id="E" className="clip" src="audio/explosion.ogg"><source src="audio/explosion.mp3" /><source src="audio/explosion.ogg" /></audio></button>
        <button id="btnHit" className="drum-pad" onClick={() => this.playAudio("A")}>A<audio id="A" className="clip" src="audio/hit.ogg"><source src="audio/hit.mp3" /><source src="audio/hit.ogg" /></audio></button>
        <button id="btnJump" className="drum-pad" onClick={() => this.playAudio("S")}>S<audio id="S" className="clip" src="audio/jump.ogg"><source src="audio/jump.mp3" /><source src="audio/jump.ogg" /></audio></button>
        <button id="btnLaser" className="drum-pad" onClick={() => this.playAudio("D")}>D<audio id="D" className="clip" src="audio/laser.ogg"><source src="audio/laser.mp3" /><source src="audio/laser.ogg" /></audio></button>
        <button id="btnPowerup" className="drum-pad" onClick={() => this.playAudio("Z")}>Z<audio id="Z" className="clip" src="audio/powerup.ogg"><source src="audio/powerup.mp3" /><source src="audio/powerup.ogg" /></audio></button>
        <button id="btnSelect" className="drum-pad" onClick={() => this.playAudio("X")}>X<audio id="X" className="clip" src="audio/select.ogg"><source src="audio/select.mp3" /><source src="audio/select.ogg" /></audio></button>
        <button id="btnStep" className="drum-pad" onClick={() => this.playAudio("C")}>C<audio id="C" className="clip" src="audio/step.ogg"><source src="audio/step.mp3" /><source src="audio/step.ogg" /></audio></button>
    */
    return (
      <div id="drum-machine" className="App">
        <div id="display"></div>
        {buttons}
      </div>
    );
  }
}

export default App;
