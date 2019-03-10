import * as t from 'io-ts'
import { Dispatch, Action, Reducer } from "redux";

import {getDispatch, getReduxState} from "../../reducer/store"
import { initialize, success } from '../../form/form';
import {FORM_NAME, formDefault} from "../../containers/registration/RequiredInfo"

const path = "/junior/required"

const validator = t.interface({
	firstName: t.string,
	middleInitial: t.string,
	lastName: t.string,
})

type ApiResponseShape = t.TypeOf<typeof validator>;

type Result = {
	[K: number]: ApiResponseShape
}

interface ApiAction extends Action {
	path: string,
	success: Result
}

export interface State {
	status: "UNINITIALIZED" | "WAITING" | "SUCCESS" | "FAILURE",
	data?: Result
}

const defaultState: State = {
	status: "UNINITIALIZED"
}

export function get(personId: number) {
	const dispatch = getDispatch();
	initialize(FORM_NAME, formDefault);
	const makeAPIRequest = getReduxState().staticState.makeAPIRequest
	return makeAPIRequest({
		httpMethod: "GET",
		path
	}).then((result: string) => {
		console.log("Got result from api: ", result)
		const parsedResult = JSON.parse(result)
		console.log("whaddaya know its a json: ", parsedResult)
		// TODO: handle this (found an unexpected field)
		for (var p in parsedResult) {
			if (undefined == (<any>formDefault)[p]) return Promise.reject(p)
		}
		success(FORM_NAME, parsedResult)
		return Promise.resolve("blah")
	})
}