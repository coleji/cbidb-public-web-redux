import * as React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux';
import { routerForBrowser } from 'redux-little-router';

import createStore from '../createStore'
import App from '../containers/App'

import {makeRootReducer} from '../reducer/rootReducer'
import routes from '../routes'



const { reducer, middleware, enhancer } = routerForBrowser({
  // The configured routes. Required.
  routes
});

const seedState = (window as any).initialStateFromServer

const rootReducer = makeRootReducer(reducer, false)

const {store, initialState} = createStore({
  rootReducer,
  enhancers: [enhancer],
  middlewares: [middleware],
  seedState
});


hydrate(
  <Provider store={store}>
      <App />
  </Provider>,
  document.getElementById('app')
);