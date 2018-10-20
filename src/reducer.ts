/// <reference path="GlobalState.d.ts" />

import { Action } from "redux";


type Reducer = (state: GlobalState, action: Action) => GlobalState

const defaultState: GlobalState = {
	counter: 0
}

const reducer: Reducer = (state = defaultState, action: Action) => {
	console.log("Running reducer", action)
	console.log("Current state", state)
	const ret = (function() {
		switch (action.type) {
			case "INCREMENT":
				return {
					...state,
					counter: state.counter+1
				};
			case "DECREMENT":
				return {
					...state,
					counter: state.counter-1
				};
			default:
				return state;
		}
	}())
	console.log("new state", ret)
	return ret;
}

export = reducer