import { Action, combineReducers } from "redux";
import { LoginState, loginReducer } from "./loginReducer"

interface State {
	login: LoginState
}

type Reducer = (state: State, action: Action) => State

const reducer: Reducer = combineReducers({
	login: loginReducer
})

export = reducer