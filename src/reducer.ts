import { Action } from "redux";

type Reducer = (state: CounterState, action: Action) => CounterState

const defaultState: CounterState = {
	currentCount: 0
}

const reducer: Reducer = (state = defaultState, action: Action) => {
//	console.log("Running reducer", action)
//	console.log("Current state", state)
	const ret = (function() {
		switch (action.type) {
			case "INCREMENT":
				return {
					...state,
					currentCount: state.currentCount+1
				};
			case "DECREMENT":
				return {
					...state,
					currentCount: state.currentCount-1
				};
			default:
				return state;
		}
	}())
//	console.log("new state", ret)
	return ret;
}

export = reducer