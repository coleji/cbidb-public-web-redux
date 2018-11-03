import { Action } from "redux";

interface LoginState {
	userName: string
}

const defaultState: LoginState = {
	userName: ""
}

type LoginActionType =
	| "LOGIN"
	| "LOGOUT"

interface LoginAction extends Action {
	type: LoginActionType,
	userName?: string
}

type LoginReducer = (state: LoginState, action: LoginAction) => LoginState

const loginReducer: LoginReducer = (state = defaultState, action) => {
	switch (action.type) {
	case "LOGIN":
		return { userName: action.userName };
	case "LOGOUT":
		return defaultState;
	default:
		return state;
	}
}

export {
	LoginState,
	loginReducer,
	LoginActionType,
	LoginAction
}