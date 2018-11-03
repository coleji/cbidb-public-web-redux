import * as React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux';
import { routerForBrowser } from 'redux-little-router';

import createStore from '../createStore'
import App from '../containers/App'

import * as counterReducer from '../reducer/globalReducer'
import routes from '../routes'



const { reducer, middleware, enhancer } = routerForBrowser({
  // The configured routes. Required.
  routes
});

const store = createStore({
  reducers: {router: reducer, counter: counterReducer, isServer: () => false},
  enhancers: [enhancer],
  middlewares: [middleware]
});


hydrate(
  <Provider store={store}>
      <App />
  </Provider>,
  document.getElementById('app')
);