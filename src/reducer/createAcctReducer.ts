import { Action } from "redux";
import {Form} from "../containers/create-acct/CreateAccount"

type FormSubSet = {
	[K in keyof Form]: Form[K]
}


export type FormActionType =
	| "FORM_UPDATE"

export interface FormAction extends Action {
	type: FormActionType,
	name?: string,
	value?: string
}

export type FormDispatch = (action: FormAction) => void;

export type FormReducer = (state: Form, action: FormAction) => Form

export const formReducer: FormReducer = (state = new Form(), action) => {
	console.log(action)
	switch (action.type) {
	case "FORM_UPDATE":
		var updated: any = {};
		updated[action.name] = action.value;
		return {...state, ...(updated as FormSubSet)};
	default:
		return state;
	}
}