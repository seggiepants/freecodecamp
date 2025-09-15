import React from 'react';
import './App.css';
import { marked } from 'marked';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import DOMPurify from 'dompurify';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.sourceChange = this.sourceChange.bind(this);    
    this.loadMarkdown = this.loadMarkdown.bind(this);
    this.renderMarkdown = this.renderMarkdown.bind(this);
  }

  componentDidMount() {
    // On startup make sure the preview is in sync
    marked.setOptions({
      gfm: true,
      breaks: true,
    });
    this.renderMarkdown(this.props.source);
    this.loadMarkdown();

  }

  sourceChange() {
    let newValue = document.getElementById("editor").value;
    this.props.submitNewMessage(newValue);
    this.renderMarkdown(newValue);
  }

  renderMarkdown(source) {
    let preview = document.getElementById("preview");
    preview.innerHTML = DOMPurify.sanitize(marked(source));
  }

  loadMarkdown() {
    fetch('https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md')
    .then(response => response.text())    
    .then(text => {
      this.props.submitNewMessage(text);
      this.sourceChange();
    })
  } 

  render() {
    return (
      
        <div className="App">
          <SplitterLayout id="split">
            <textarea id="editor" onChange={this.sourceChange} value={this.props.source}></textarea>
            <div id="preview"></div>
          </SplitterLayout>
        </div>
    );
  }
}

export default App;