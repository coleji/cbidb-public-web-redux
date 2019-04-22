import * as t from 'io-ts'
import APIWrapper, { HttpMethod } from '../../APIWrapper';

const validator = t.type({
	firstName: t.union([t.string, t.undefined]),
	lastName: t.union([t.string, t.undefined]),
	middleInitial: t.union([t.string, t.undefined])
})

const path = "/junior/required"

export const getWrapper = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator
})

export const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: t.string
})

