import React from 'react';
import ReactDOM from 'react-dom';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic';

import App from './components/App';

const options = {
  position: positions.TOP_RIGHT,
  timeout: 5000,
  offset: '30px',
  transition: transitions.SCALE
}

const Root = () => {
  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <App />
    </AlertProvider>
  )
}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);