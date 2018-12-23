import { Action, Reducer, combineReducers } from "redux";

import {formReducer} from "../form/form"

import {loginFormReducer, LoginForm} from "../containers/LoginPage"
import {CreateAccountForm, FORM_NAME as createAccountFormName} from "../containers/create-acct/CreateAccount"

import {LoginState, loginReducer} from "./loginStateReducer"


export interface RootState {
	login: LoginState,
	router: Location,
	isServer: boolean,
	loginForm: LoginForm,
	createAcctForm: CreateAccountForm
}

export type RootReducer = (state: RootState, action: Action) => RootState

export const makeRootReducer: (router: Reducer, isServer: Boolean) => RootReducer = (router: Reducer, isServer: any) => {
	return combineReducers({
		router,
		isServer: () => isServer,
		login: loginReducer,
		loginForm: loginFormReducer,
		createAcctForm: formReducer<CreateAccountForm>(createAccountFormName)
	})	
}
