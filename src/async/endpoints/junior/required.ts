import * as t from 'io-ts'
import APIWrapper, { HttpMethod } from '../../APIWrapper';

export const validator = t.type({
	firstName: t.union([t.string, t.null]),
	lastName: t.union([t.string, t.null]),
	middleInitial: t.union([t.string, t.null]),
	dob: t.union([t.string, t.null]),
	childEmail: t.union([t.string, t.null]),
	addr1: t.union([t.string, t.null]),
	addr2: t.union([t.string, t.null]),
	addr3: t.union([t.string, t.null]),
	city: t.union([t.string, t.null]),
	state: t.union([t.string, t.null]),
	zip: t.union([t.string, t.null]),
	country: t.union([t.string, t.null]),
	primaryPhone: t.union([t.string, t.null]),
	primaryPhoneType: t.union([t.string, t.null]),
	alternatePhone: t.union([t.string, t.null]),
	alternatePhoneType: t.union([t.string, t.null]),
	allergies: t.union([t.string, t.null]),
	medications: t.union([t.string, t.null]),
	specialNeeds: t.union([t.string, t.null])
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