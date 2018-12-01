import { Action } from "redux";

interface LoginState {
	userName: string,
	password: string,
	asyncState: AsyncState
}

type AsyncState = 
	| "LOADING"
	| "SUCCESS"
	| "FAILURE"

const defaultState: LoginState = {
	userName: "",
	password: "",
	asyncState: null
}

type LoginActionType =
	| "LOGIN_REQUEST"
	| "LOGIN_SUCCESS"
	| "LOGIN_FAILURE"
	| "LOGOUT"
	| "USERNAME"
	| "PASSWORD"

interface LoginAction extends Action {
	type: LoginActionType,
	userName?: string,
	password?: string
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
	case "USERNAME":
		return {...state, userName: action.userName };
	case "PASSWORD":
		return {...state, password: action.password };
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