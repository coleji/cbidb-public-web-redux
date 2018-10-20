import * as React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import * as Router from 'react-router-redux'

import createStore from '../createStore'
import App from '../containers/App'

const store = createStore();

// Create an enhanced history that syncs navigation events with the store
const history = Router.syncHistoryWithStore(createBrowserHistory(), store)

hydrate(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>,
	document.getElementById('app')
);