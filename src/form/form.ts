import { Dispatch, Action, Reducer } from "redux";
import * as t from 'io-ts'

import {getDispatch, getReduxState} from "../reducer/store"
import APIWrapper, { PostJSON } from "../async/APIWrapper";
import { some, none, Option } from "fp-ts/lib/Option";

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
	data: Option<T>
}

// export function initialize<T>(formName: string, defaultValue: T) {
// 	const dispatch = getDispatch();
// 	dispatch({
// 		type: "INITIALIZE_FORM",
// 		formName,
// 		data: defaultValue
// 	})
// }

export function success<T>(formName: string, result: T) {
	const dispatch = getDispatch();
	dispatch({
		type: "SET_FORM",
		formName,
		data: some(result)
	})
}

// export const get = <T_Form, T_APIValidator extends t.Any>(formName: string, apiw: APIWrapper<T_APIValidator, any, any>, mapper: (api: t.TypeOf<T_APIValidator>) => T_Form) => 
// 	getWithDefault(formName, {}, apiw, mapper)

export const get = <T_Form, T_APIValidator extends t.Any>(
	formName: string,
	defaultState: T_Form,
	apiw: APIWrapper<T_APIValidator, any, any>,
	mapper: (api: t.TypeOf<T_APIValidator>) => T_Form
) => {
	const dispatch = getDispatch();
	dispatch({
		type: "INITIALIZE_FORM",
		formName,
		data: none
	})
	// make api call to get form state
	return apiw.send(getReduxState().staticState.selfServerParams)(null).then((result: string) => {
		console.log("Got result from api: ", result.substr(0,50))
		const parsedResult = apiw.parseResponse(result)
		if (parsedResult.type == "Success") {
			success(formName, mapper(parsedResult.result))
			return Promise.resolve("blah")
		} else {
			console.log(parsedResult.failureType)
			console.log(parsedResult.err)
			return Promise.reject(parsedResult.failureType)
		}
		// set form to result from api
		
	}).catch(err => {
		console.log("Error: ", err)
	}).then(() => {
		console.log("finished form get")
	})
}

export const post = <T extends object>(formName: string, apiw: APIWrapper<any, T, any>) => (dataForAPI: T) => {
	return apiw.send(getReduxState().staticState.selfServerParams)(PostJSON(dataForAPI)).then((result: string) => {
		console.log("Got result from api: ", result)
		return Promise.resolve("blah")
	})
}

export const formReducer: <T extends object>(formName: string, defaultState: T) => Reducer<FormState<T>> = 
<T extends object>(formName: string, defaultState: T) => (state: FormState<T>, action: FormAction<T>) => {
	const startState = state || {
		apiState: "UNINITIALIZED",
		data: none
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
		updated[updateAction.fieldName] = (updateAction.fieldValue == null || updateAction.fieldValue == "") ? none : some(updateAction.fieldValue);
		return {
			apiState: startState.apiState,
			data: some(<T>{...<object>startState.data.getOrElse({} as any), ...<object>(updated as FormSubSet)})
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
	data: Option<T>
}

type FormAction<T> = 
	| FormUpdateAction
	| FormSetAction<T>