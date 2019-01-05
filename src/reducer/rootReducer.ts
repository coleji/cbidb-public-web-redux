import { Action, Reducer, combineReducers } from "redux";

import {formReducer} from "../form/form"
import {LoginState, loginReducer} from "./loginStateReducer"

import {loginFormReducer, Form as LoginForm} from "../containers/LoginPage"
import {Form as RegistrationRequiredInfoForm, FORM_NAME as registrationRequiredInfoFormName} from "../containers/registration/RequiredInfo"
import {Form as CreateAccountForm, FORM_NAME as createAccountFormName} from "../containers/create-acct/CreateAccount"
import * as moment from "moment";

export interface RootState {
	getMoment: () => moment.Moment,
	login: LoginState,
	router: Location,
	isServer: boolean,
	loginForm: LoginForm,
	createAcctForm: CreateAccountForm,
	registrationRequiredInfoForm: RegistrationRequiredInfoForm
}

export type RootReducer = (state: RootState, action: Action) => RootState

export const makeRootReducer: (router: Reducer, isServer: boolean, getMoment: () => moment.Moment) => RootReducer = 
(router, isServer, getMoment) => {
	return combineReducers({
		getMoment: () => getMoment,
		router,
		isServer: () => isServer,
		login: loginReducer,
		loginForm: loginFormReducer,
		createAcctForm: formReducer<CreateAccountForm>(createAccountFormName),
		registrationRequiredInfoForm: formReducer<RegistrationRequiredInfoForm>(registrationRequiredInfoFormName),
	})	
}
