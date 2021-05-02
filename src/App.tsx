import React from 'react';
import './App.css';
import store from "./redux/store";
import Main from "./Main";
import {HashRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";

require('./index.less');

const App: React.FC = () => {
  return (
    <Router basename={''}>
      <Provider store={store}>
        <Main/>
      </Provider>
    </Router>
  );
};


export default App;