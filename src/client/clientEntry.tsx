import * as React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'
import { routerForBrowser } from 'redux-little-router';

import createStore from '../createStore'
import App from '../containers/App'

import * as counterReducer from '../reducer'
import routes from '../routes'



const { reducer, middleware, enhancer } = routerForBrowser({
  // The configured routes. Required.
  routes
});

const store = createStore({
  reducers: {router: reducer, counter: counterReducer},
  enhancers: [enhancer],
  middlewares: [middleware],
  addDevTools: true
});


hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
);