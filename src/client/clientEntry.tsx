require("../../lib/array-polyfill")
require("../../lib/optional")

import * as React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux';
import * as moment from "moment"
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'

import createStore from '../createStore'
import App from '../containers/App'

import {makeRootReducer, StaticState} from '../reducer/rootReducer'


export const history = createBrowserHistory()

const seedState = (window as any).initialStateFromServer

const staticState: StaticState = {
  ...seedState.staticState,
  isServer: false,
  getMoment: () => moment(),
}

const rootReducer = makeRootReducer(history, staticState)

export const {store, initialState} = createStore({
  rootReducer,
  enhancers: [],
  middlewares: [routerMiddleware(history)],
  seedState
});


hydrate(
  <Provider store={store}>
      <App history={history}/>
  </Provider>,
  document.getElementById('app')
);