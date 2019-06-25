import * as t from 'io-ts'
import APIWrapper, { HttpMethod } from '../../core/APIWrapper';
import {OptionalString} from '../../util/OptionalTypeValidators'

export const validator = t.array(t.type({
	typeId: t.number,
	canSee: t.boolean
}))


const path = "/junior/get-class-instances"

export const getWrapper = (typeId: number, juniorId: number) => new APIWrapper<typeof validator, {}, {}>({
	path: path + `?typeId=${typeId}&juniorId=${juniorId}`,
	type: HttpMethod.GET,
	resultValidator: validator
})