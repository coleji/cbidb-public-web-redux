import { createStore as reduxCreateStore, applyMiddleware, compose } from 'redux';
import {RootReducer} from './reducer/rootReducer'

interface CreateStoreParameters {
  rootReducer: RootReducer,
  enhancers?: any[],
  middlewares?: any[],
  seedState?: any
}

export default function createStore(params: CreateStoreParameters) {
	const DevTools = require('./DevTools').default;
	const middleware = params.middlewares || [];
	const enhancers = params.enhancers || [];

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

	const rootReducer = params.rootReducer;

	const allEnhancers = [
		...enhancers,
		applyMiddleware(
		...middleware, // for dispatching history actions
		// ... other middlewares ...
		),
		DevTools.instrument()
	]
	console.log("opening with seed state: ", params.seedState)
	const initialState = rootReducer(params.seedState, {type: "whatever"})

	console.log(initialState)

	const store = reduxCreateStore(
		rootReducer, // new root reducer with router state
		initialState,
		compose(...allEnhancers),
	  )

	//reduxRouterMiddleware.listenForReplays(store);

	/*if (__DEVELOPMENT__ && module.hot) {
		module.hot.accept('../src/view/reducer', () => {
			store.replaceReducer(require('../src/view/reducer'));
		});
	}*/

	return {store, initialState};
}