import * as React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import createStore from '../createStore'
import App from '../containers/App'

const history = createBrowserHistory()
const store = createStore(history);

hydrate(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>,
	document.getElementById('app')
);