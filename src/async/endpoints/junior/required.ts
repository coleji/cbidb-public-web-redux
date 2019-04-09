import * as t from 'io-ts'
import APIWrapper, { HttpMethod } from '../../APIWrapper';

const validator = t.type({
	firstName: t.union([t.string, t.null]),
	lastName: t.union([t.string, t.null]),
	middleInitial: t.union([t.string, t.null])
})

const path = "/junior/required"

const getWrapper = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
	extraHeaders: None()
})

const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: t.string,
	extraHeaders: None()
})

