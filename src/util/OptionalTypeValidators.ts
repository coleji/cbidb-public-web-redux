import * as t from 'io-ts'
import { Option, some, none } from 'fp-ts/lib/Option';

export const OptionalString = new t.Type<Option<string>, string, unknown>(
	'OptionalString',
	(u): u is Option<string> => u instanceof Option,
	(u, c) =>
		t.union([t.string, t.null, t.undefined]).validate(u, c).chain(s => {
			if (s === null || s === undefined) return t.success(<Option<string>>none)
			else return t.success(some(s))
		}),
	a => a.fold("None", (s) => `some(${s})`)
)

export const OptionalNumber = new t.Type<Option<number>, string, unknown>(
	'OptionalNumber',
	(u): u is Option<number> => u instanceof Option,
	(u, c) =>
		t.union([t.number, t.null, t.undefined]).validate(u, c).chain(s => {
			if (s === null || s === undefined) return t.success(<Option<number>>none)
			else return t.success(some(s))
		}),
		a => a.fold("None", (s) => `some(${s})`)
)

export const OptionalBoolean = new t.Type<Option<boolean>, string, unknown>(
	'OptionalBoolean',
	(u): u is Option<boolean> => u instanceof Option,
	(u, c) =>
		t.union([t.boolean, t.null, t.undefined]).validate(u, c).chain(s => {
			if (s === null || s === undefined) return t.success(<Option<boolean>>none)
			else return t.success(some(s))
		}),
		a => a.fold("None", (s) => `some(${s})`)
)