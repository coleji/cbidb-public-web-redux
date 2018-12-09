import { Action, Reducer, combineReducers } from "redux";
import { LoginState, loginReducer } from "./loginStateReducer"
import {LoginFormState, loginFormReducer} from "./loginFormReducer"

export interface RootState {
	login: LoginState,
	router: Location,
	isServer: boolean,
	loginForm: LoginFormState,
	updatedFormName: String
}

export type RootReducer = (state: RootState, action: Action) => RootState

export const makeRootReducer: (router: Reducer, isServer: Boolean) => RootReducer = (router: Reducer, isServer: any) => {
	return combineReducers({
		router,
		isServer: () => isServer,
		login: loginReducer,
		loginForm: loginFormReducer,
		updatedFormName: () => ""
	})	
}
