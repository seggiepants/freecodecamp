import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import App from './App';

const defaultText = `# Loading
## Please wait...
Sample markdown is being loaded from [github.com](https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md).

This is supposed to have several other elements like:
* Little
* Green
* Men

Inline \`code\` is something I **need** to show.

A list, and a code block
\`\`\`
10 PRINT "HELLO WORLD"
20 GOTO 10
\`\`\`

> Four score
> and seven years ago.

![fish sticks](https://raw.githubusercontent.com/seggiepants/freecodecamp/master/responsive%20web%20design/product%20landing%20page/data/fish_sticks.png "Johnson &amp; Mills Fish Sticks")
`;

// Action
const SOURCE = 'Source';
const modifySource = (value) => {
  return {
    type: SOURCE,
    source: value,
  };
};

// Reducer
const messageReducer = (state = defaultText, action) => {
  switch(action.type) {
    case SOURCE:
      return action.source;
    default:
      return state;
  };
};

// Dispatch
const mapStateToProps = (state) => {
  return {source: state}
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitNewMessage: (value) => {
      dispatch(modifySource(value))
    }
  }
};

// Store
const store = createStore(messageReducer);

const Container = connect(mapStateToProps, mapDispatchToProps)(App);
ReactDOM.render(<Provider store={store}><Container /></Provider>, document.getElementById('root'));
