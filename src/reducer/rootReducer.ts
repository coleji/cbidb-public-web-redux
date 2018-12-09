import { Action, Reducer, combineReducers } from "redux";
import { reducer as formReducer, FormStateMap } from 'redux-form';
import { LoginState, loginReducer } from "./loginStateReducer"

export interface RootState {
	login: LoginState,
	router: Location,
	isServer: boolean,
	form: FormStateMap
}

export type RootReducer = (state: RootState, action: Action) => RootState

export const makeRootReducer: (router: Reducer, isServer: Boolean) => RootReducer = (router: Reducer, isServer: any) => {
	return combineReducers({
		router,
		isServer: () => isServer,
		login: loginReducer,
		form: formReducer
	})	
}
