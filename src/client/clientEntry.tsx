import * as React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux';
import * as moment from "moment"
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'

import createStore from '../createStore'
import App from '../containers/App'
import {makeHTTPRequest} from "../async/async"
import {setStore} from "../reducer/store"

import {makeRootReducer, StaticState} from '../reducer/rootReducer'

require("../../lib/array-polyfill")
require("../../lib/optional")

const arr1 = ['a','b','c']
const arr2 = arr1.zipWithIndex()
console.log(arr2)
const s = Some("tssdf")
const n = None()
console.log(s.map(e => e.length))


export const history = createBrowserHistory()

const seedState = (window as any).initialStateFromServer

const staticState: StaticState = {
  ...seedState.staticState,
  isServer: false,
  getMoment: () => moment(),
  makeAPIRequest: makeHTTPRequest(seedState.staticState.serverConfig.SELF)
}

const rootReducer = makeRootReducer(history, staticState)

export const {store, initialState} = createStore({
  rootReducer,
  enhancers: [],
  middlewares: [routerMiddleware(history)],
  seedState
});

setStore(store)

hydrate(
  <Provider store={store}>
      <App history={history}/>
  </Provider>,
  document.getElementById('app')
);