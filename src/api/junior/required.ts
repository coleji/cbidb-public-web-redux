import * as t from 'io-ts'
import { Dispatch, Action, Reducer } from "redux";

import {getDispatch, getReduxState} from "../../reducer/store"

const path = "/junior/required"

const validator = t.interface({
	nameFirst: t.string,
	nameLast: t.string,
	nameMiddleInitial: t.string
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
	dispatch({
		type: "MAKE_REQ",
		path
	})
	const makeAPIRequest = getReduxState().staticState.makeAPIRequest
	return makeAPIRequest({
		httpMethod: "GET",
		path
	}).then((result: string) => {
		dispatch({
			type: "SUCCESS",
			path,
			success: JSON.parse(result)
		})
		console.log("Got result from api: ", result)
		console.log("whaddaya know its a json: ", JSON.parse(result))
		return Promise.resolve("blah")
	})
}

export const reducer: (state: State, action: ApiAction) => State = (state=defaultState, action) => {
	if (action.path != path) return state;

	switch (action.type) {
	case "MAKE_REQ":
		return {
			status: "WAITING"
		}
	case "SUCCESS":
		return {
			status: "SUCCESS",
			data: action.success
		}
	case "FAILURE":
		return {
			status: "FAILURE"
		}
	default:
		return state;
	}
}
