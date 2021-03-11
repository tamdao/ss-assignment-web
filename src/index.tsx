import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import './index.css';
import App from './App';
import store from './store';
import reportWebVitals from './reportWebVitals';
import GoogleFontLoader from 'react-google-font-loader';
import api from './utils/api';

ReactDOM.render(
  <React.StrictMode>
    <GoogleFontLoader
      fonts={[
        {
          font: 'Open Sans',
          weights: [400],
        },
      ]}
    />
    <ApolloProvider client={api}>
      <Provider store={store}>
        <App />
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
