import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router'

declare var __DEVELOPMENT__: any
declare var __CLIENT__: any
declare var __DEVTOOLS__: any

export default function createStore() {
	const DevTools = require('./DevTools').default;
	const middleware: any[] = [/*routerMiddleware(history)*/];

	//TODO: prod vs dev mode, i.e. dont initialize DevTools stuff

/*
	let finalCreateStore;
	if (true){ // __DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
		const { persistState } = require('redux-devtools');
		
		finalCreateStore = compose(
//			applyMiddleware(...middleware),
			DevTools.instrument()
		)(_createStore);
	} else {
		finalCreateStore = applyMiddleware(...middleware)(_createStore);
	}*/
	const reducer = require('./reducer');

	const connectedReducer = /*(!!history) ? connectRouter(history)(reducer) :*/ reducer;

	const store = _createStore(
		connectedReducer, // new root reducer with router state
		reducer(undefined, {type: "whatever"}),
		compose(
		  applyMiddleware(
			...middleware, // for dispatching history actions
			// ... other middlewares ...
		  ), DevTools.instrument()
		),
	  )

	//reduxRouterMiddleware.listenForReplays(store);

	/*if (__DEVELOPMENT__ && module.hot) {
		module.hot.accept('../src/view/reducer', () => {
			store.replaceReducer(require('../src/view/reducer'));
		});
	}*/

	return store;
}