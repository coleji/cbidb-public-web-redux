import { Action } from "redux";

interface LoginState {
	userName: string
	asyncState: AsyncState
}

type AsyncState = 
	| "LOADING"
	| "SUCCESS"
	| "FAILURE"

const defaultState: LoginState = null; /*{
	userName: "",
	asyncState: "LOADING"
}*/

type LoginActionType =
	| "LOGIN_REQUEST"
	| "LOGIN_SUCCESS"
	| "LOGIN_FAILURE"
	| "LOGOUT"

interface LoginAction extends Action {
	type: LoginActionType,
	userName?: string
}

type LoginDispatch = (action: LoginAction) => void;

type LoginReducer = (state: LoginState, action: LoginAction) => LoginState

const loginReducer: LoginReducer = (state = defaultState, action) => {
	switch (action.type) {
	case "LOGIN_REQUEST":
		return { userName: action.userName, asyncState: "LOADING" };
	case "LOGIN_SUCCESS":
		return { userName: action.userName, asyncState: "SUCCESS" };
	case "LOGIN_FAILURE":
		return { userName: action.userName, asyncState: "FAILURE" };
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
	LoginAction,
	LoginDispatch
}