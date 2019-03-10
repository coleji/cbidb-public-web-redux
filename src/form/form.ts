import { Dispatch, Action, Reducer } from "redux";

import {getDispatch, getReduxState} from "../reducer/store"

export const UPDATE_FORM_DISPATCH_TYPE = "UPDATE_FORM";

export const dispatchFormUpdate: <T>(dispatch: Dispatch<FormAction<T>>, formName: string) => (fieldName: string, fieldValue: any) => void = 
(dispatch, formName) => (fieldName, fieldValue) => dispatch({
    type: UPDATE_FORM_DISPATCH_TYPE, formName, fieldName, fieldValue
})

type ApiState = 
	| "UNINITIALIZED"
	| "WAITING"
	| "SUCCESS"
	| "FAILURE"

export type FormState<T> = {
	apiState: ApiState,
	data?: T
}

const defaultState: FormState<any> = {
	apiState: "UNINITIALIZED",
	data: {}
}

export function initialize<T>(formName: string, defaultValue: T) {
	const dispatch = getDispatch();
	dispatch({
		type: "INITIALIZE_FORM",
		formName,
		data: defaultValue
	})
}

export function success<T>(formName: string, result: T) {
	const dispatch = getDispatch();
	dispatch({
		type: "SET_FORM",
		formName,
		data: result
	})
}

export const formReducer: <T extends object>(formName: string) => Reducer<FormState<T>> = 
<T extends object>(formName: string) => (state: FormState<T> = defaultState, action: FormAction<T>) => {
    type FormSubSet = {
        [K in keyof T]: T[K]
    }

    if (action.formName != formName) return state;
    
    console.log(action)
    switch (action.type) {
	case "UPDATE_FORM":
		const updateAction = <FormUpdateAction>action;
        var updated: any = {};
        updated[updateAction.fieldName] = updateAction.fieldValue;
		return {
			apiState: state.apiState,
			data: <T>{...<object>state.data, ...<object>(updated as FormSubSet)}
		};
	case "SET_FORM":
		const setAction = <FormSetAction<T>>action;
		return {
			apiState: "SUCCESS",
			data: setAction.data
		};
	case "INITIALIZE_FORM":
		const setAction2 = <FormSetAction<T>>action;
		return {
			apiState: "WAITING",
			data: setAction2.data
		}
    default:
        return state;
    }
}

type FormActionType =
	| "UPDATE_FORM"
	| "SET_FORM"
	| "INITIALIZE_FORM"

interface FormUpdateAction extends Action {
    type: FormActionType,
    formName: string,
	fieldName: string,
	fieldValue: any
}

interface FormSetAction<T> extends Action {
	type: FormActionType,
    formName: string,
	data: T
}

type FormAction<T> = 
	| FormUpdateAction
	| FormSetAction<T>