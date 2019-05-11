import * as t from 'io-ts'
import { Option, none } from 'fp-ts/lib/Option';

// Given a type validator, return the object that is t.TypeOf<typeof validator> but with all the props as none
export default function makeDefault<T extends t.Props, U extends t.TypeC<T>>(validator: U): {[K in keyof t.TypeOf<U>]: Option<t.TypeOf<U>[K]>} {
	let ret: any = {}
	Object.keys(validator).forEach(key => {
		ret[key] = none
	})
	return <{[K in keyof t.TypeOf<U>]: Option<t.TypeOf<U>[K]>}>ret
}