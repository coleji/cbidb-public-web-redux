require("../../lib/array-polyfill")
require("../../lib/optional")

import * as React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux';
import { routerForBrowser } from 'redux-little-router';
import * as moment from "moment"

import createStore from '../createStore'
import App from '../containers/App'

import {makeRootReducer, StaticState} from '../reducer/rootReducer'
import routes from '../routes'

const { reducer, middleware, enhancer } = routerForBrowser({
  // The configured routes. Required.
  routes
});

const seedState = (window as any).initialStateFromServer

const staticState: StaticState = {
  ...seedState.staticState,
  isServer: false,
  getMoment: () => moment(),
}

const rootReducer = makeRootReducer(reducer, staticState)

export const {store, initialState} = createStore({
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