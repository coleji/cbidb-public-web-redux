import * as t from 'io-ts'
import APIWrapper, { HttpMethod } from '../../APIWrapper';

export const validator = t.type({
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