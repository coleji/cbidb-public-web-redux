import * as t from 'io-ts'

export const OptionalString = new t.Type<Optional<string>, string, unknown>(
	'OptionalString',
	(u): u is Optional<string> => u instanceof Optional,
	(u, c) =>
		t.union([t.string, t.null, t.undefined]).validate(u, c).chain(s => {
			if (s === null || s === undefined) return t.success(<Optional<string>>None())
			else return t.success(Some(s))
		}),
	a => a.match({some: (s) => `Some(${s})`, none: () => "None"})
)

export const OptionalNumber = new t.Type<Optional<number>, string, unknown>(
	'OptionalNumber',
	(u): u is Optional<number> => u instanceof Optional,
	(u, c) =>
		t.union([t.number, t.null, t.undefined]).validate(u, c).chain(s => {
			if (s === null || s === undefined) return t.success(<Optional<number>>None())
			else return t.success(Some(s))
		}),
	a => a.match({some: (n) => `Some(${n})`, none: () => "None"})
)

export const OptionalBoolean = new t.Type<Optional<boolean>, string, unknown>(
	'OptionalBoolean',
	(u): u is Optional<boolean> => u instanceof Optional,
	(u, c) =>
		t.union([t.boolean, t.null, t.undefined]).validate(u, c).chain(s => {
			if (s === null || s === undefined) return t.success(<Optional<boolean>>None())
			else return t.success(Some(s))
		}),
	a => a.match({some: (b) => `Some(${b})`, none: () => "None"})
)