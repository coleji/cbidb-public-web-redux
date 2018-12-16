import { Action } from "redux";

interface LoginFormState {
	usernameForm: string,
	passwordForm: string
}

const defaultState: LoginFormState = {
	usernameForm: "",
	passwordForm: ""
}

type LoginFormActionType =
	| "UPDATE_FORM"
	| "LOGIN_FAILURE"

interface LoginFormAction extends Action {
	type: LoginFormActionType,
	name?: string,
	value?: string
}

type LoginFormDispatch = (action: LoginFormAction) => void;

type LoginFormReducer = (state: LoginFormState, action: LoginFormAction) => LoginFormState

const loginFormReducer: LoginFormReducer = (state = defaultState, action) => {
	console.log(action)
	switch (action.type) {
	case "UPDATE_FORM":
		if (action.name == "P101_USERNAME") return {...state, usernameForm: action.value}
		if (action.name == "P101_PASSWORD") return {...state, passwordForm: action.value}
		else return state;
	case "LOGIN_FAILURE":
		return {...state, usernameForm: "", passwordForm: ""}
	default:
		return state;
	}
}

export {
	LoginFormState,
	loginFormReducer,
	LoginFormActionType,
	LoginFormAction,
	LoginFormDispatch
}