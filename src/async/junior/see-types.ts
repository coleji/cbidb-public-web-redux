import * as t from 'io-ts'
import APIWrapper, { HttpMethod } from '../../core/APIWrapper';

export const validator = t.array(t.type({
	typeId: t.number,
	canSee: t.boolean
}))

const path = "/junior/see-types"

export const getWrapper = (personId: number) => new APIWrapper<typeof validator, {}, {}>({
	path: path + "?personId=" + personId,
	type: HttpMethod.GET,
	resultValidator: validator
})
