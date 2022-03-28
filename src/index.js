import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './style/style.css'
import { BrowserRouter } from "react-router-dom";
import App from './App';
import Amplify, {Auth} from 'aws-amplify'
import awsExports from './aws-exports'
import getSuccessResponse from './utils/getSuccessResponse'

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          <App />
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
