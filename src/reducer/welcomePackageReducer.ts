import { Action } from "redux";

interface WelcomePackageState {
	parentPersonId: number,
	userName: string,
	children: {
		personId: number,
		nameFirst: string,
		nameLast: string,
		status: string,
		actions: string
	}[]
}


const defaultState: WelcomePackageState = {
	parentPersonId: null,
	userName: null,
	children: []
}

type WeclomePackageActionType =
	| "WELCOME_PKG_UPDATE"

type WeclomePackageAction = Action & WelcomePackageState & {
	type: WeclomePackageActionType
}

type WeclomePackageDispatch = (action: WeclomePackageAction) => void;

type WeclomePackageReducer = (state: WelcomePackageState, action: WeclomePackageAction) => WelcomePackageState

const welcomePackageReducer: WeclomePackageReducer = (state = defaultState, action) => {
	console.log(action)
	switch (action.type) {
	case "WELCOME_PKG_UPDATE":
		return {
			...state,
			...action
		}
	default:
		return state;
	}
}

export {
	welcomePackageReducer,
	WelcomePackageState
}