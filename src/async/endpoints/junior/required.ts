import * as t from 'io-ts'
import APIWrapper, { HttpMethod } from '../../APIWrapper';
import {OptionalString} from '../../../util/OptionalTypeValidators'
import { Validator } from 'react';

export const validator = t.type({
	firstName: OptionalString,
	lastName: OptionalString,
	middleInitial: OptionalString,
	dob: OptionalString,
	childEmail: OptionalString,
	addr1: OptionalString,
	addr2: OptionalString,
	addr3: OptionalString,
	city: OptionalString,
	state: OptionalString,
	zip: OptionalString,
	country: OptionalString,
	primaryPhone: OptionalString,
	primaryPhoneType: OptionalString,
	alternatePhone: OptionalString,
	alternatePhoneType: OptionalString,
	allergies: OptionalString,
	medications: OptionalString,
	specialNeeds: OptionalString
})

const path = "/junior/required"

export const getWrapper = (personId: number) => new APIWrapper<typeof validator, {}, {}>({
	path: path + "?personId=" + personId,
	type: HttpMethod.GET,
	resultValidator: validator
})

export const postWrapper = (personId: number) => new APIWrapper<typeof t.string, t.TypeOf<typeof validator>, {personId: number}>({
	path,
	type: HttpMethod.POST,
	resultValidator: t.string,
	fixedParams: {personId}
})



// export const formDefault = {
// 	firstName: "",
// 	middleInitial: "",
// 	lastName: "",
// 	// dobMonth: string,
// 	// dobDate: string,
// 	// dobYear: string,
// 	// childEmail: string,
// 	// addr_1: string,
// 	// addr_2: string,
// 	// addr_3: string,
// 	// city: string,
// 	// state: string,
// 	// zip: string,
// 	// country: string,
// 	// primaryPhoneFirst: string,
// 	// primaryPhoneSecond: string,
// 	// primaryPhoneThird: string,
// 	// primaryPhoneExt: string,
// 	// primaryPhoneType: string,
// 	// alternatePhoneFirst: string,
// 	// alternatePhoneSecond: string,
// 	// alternatePhoneThird: string,
// 	// alternatePhoneExt: string,
// 	// alternatePhoneType: string,
// 	// allergies: string,
// 	// medications: string,
// 	// specialNeeds: string
	
// }