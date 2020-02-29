import React from 'react';
import ReactDOM from 'react-dom';
import Redux from 'redux';
import ReactRedux from 'react-redux';
import App from './App';

const SOURCE = 'Source';

const modifySource = (value) => {
  return {
    type: SOURCE,
    source: value,
  };
};

const messageReducer = (state = '', action) => {
  switch(action.type) {
    case SOURCE:
      return action.source;
    default:
      return state;
  };
};

const store = Redux.createStore(messageReducer);
const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;

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

const Container = connect(mapStateToProps, mapDispatchToProps)(App);
ReactDOM.render(<Provider store={store}><Container /></Provider>, document.getElementById('root'));
