import { Action } from "redux";

interface LoginState {
	authenticatedUserName: string,
	asyncState: AsyncState,
	usernameForm: string,
	passwordForm: string
}

type AsyncState = 
	| "LOADING"
	| "SUCCESS"
	| "FAILURE"

const defaultState: LoginState = {
	authenticatedUserName: null,
	asyncState: null,
	usernameForm: "",
	passwordForm: ""
}

type LoginActionType =
	| "LOGIN_REQUEST"
	| "LOGIN_SUCCESS"
	| "LOGIN_FAILURE"
	| "LOGOUT"
	| "FIELD"

interface LoginAction extends Action {
	type: LoginActionType,
	userName?: string,
	password?: string,
	name?: string,
	value?: string
}

type LoginDispatch = (action: LoginAction) => void;

type LoginReducer = (state: LoginState, action: LoginAction) => LoginState

const loginReducer: LoginReducer = (state = defaultState, action) => {
	console.log(action)
	switch (action.type) {
	case "LOGIN_REQUEST":
		return { ...state, asyncState: "LOADING", };
	case "LOGIN_SUCCESS":
		return { ...state, asyncState: "SUCCESS" };
	case "LOGIN_FAILURE":
		return { ...state, asyncState: "FAILURE" };
	case "LOGOUT":
		return defaultState;
	case "FIELD":
		if (action.name == "P101_USERNAME") return {...state, usernameForm: action.value}
		if (action.name == "P101_PASSWORD") return {...state, passwordForm: action.value}
		else return state;
	default:
		return state;
	}
}

export {
	LoginState,
	loginReducer,
	LoginActionType,
	LoginAction,
	LoginDispatch
}