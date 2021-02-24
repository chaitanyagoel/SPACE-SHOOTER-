import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Data from './App.js';


ReactDOM.render(<Data/>, document.getElementById('root'));
serviceWorker.unregister();
