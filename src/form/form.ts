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

export function get<T>(formName: string, formDefault: T, path: string) {
	initialize(formName, formDefault);
	return getReduxState().staticState.makeAPIRequest({
		httpMethod: "GET",
		path
	}).then((result: string) => {
		console.log("Got result from api: ", result)
		const parsedResult = JSON.parse(result)
		console.log("whaddaya know its a json: ", parsedResult)
		// TODO: handle this (found an unexpected field)
		for (var p in parsedResult) {
			if (undefined === (formDefault as any)[p]) return Promise.reject(p)
		}
		success(formName, parsedResult)
		return Promise.resolve("blah")
	}).catch(err => {
		console.log("Error: ", err)
	}).then(() => {
		console.log("finished form get")
	})
}

export function post<T extends object>(formName: string, state: T, path: string) {
	return getReduxState().staticState.makeAPIRequest({
		httpMethod: "POST",
		path,
		postData: state
	}).then((result: string) => {
		console.log("Got result from api: ", result)
		return Promise.resolve("blah")
	})
}

export const formReducer: <T extends object>(formName: string, defaultState: T) => Reducer<FormState<T>> = 
<T extends object>(formName: string, defaultState: T) => (state: FormState<T>, action: FormAction<T>) => {
	const startState = state || {
		apiState: "UNINITIALIZED",
		data: defaultState
	}

    type FormSubSet = {
        [K in keyof T]: T[K]
    }

    if (action.formName != formName) return startState;
    
    console.log("ACTION: ", action)
    switch (action.type) {
	case "UPDATE_FORM":
		const updateAction = <FormUpdateAction>action;
        var updated: any = {};
        updated[updateAction.fieldName] = updateAction.fieldValue;
		return {
			apiState: startState.apiState,
			data: <T>{...<object>startState.data, ...<object>(updated as FormSubSet)}
		};
	case "SET_FORM":
		const setAction = <FormSetAction<T>>action;
		console.log("about to return")
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
        return startState;
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