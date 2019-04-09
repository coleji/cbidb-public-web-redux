import * as t from 'io-ts'
import APIWrapper, { HttpMethod } from '../../APIWrapper';

const shape = t.type({
	firstName: t.union([t.string, t.null]),
	lastName: t.union([t.string, t.null]),
	middleInitial: t.union([t.string, t.null])
})

type Shape = t.TypeOf<typeof shape>

const path = "/junior/required"

const getWrapper = new APIWrapper({
	path,
	type: HttpMethod.GET,
	extraHeaders: None(),
	parseServerResponse: () => null,
	parseRequestFailure: () => null
})

const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	extraHeaders: None(),
	parseServerResponse: () => null,
	parseRequestFailure: () => null
})

