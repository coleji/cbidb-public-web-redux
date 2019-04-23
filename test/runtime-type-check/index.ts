import * as t from 'io-ts'
import { PathReporter } from 'io-ts/lib/PathReporter'
import * as assert from "assert"

const shape = t.type({
	someString: t.string,
	someNumber: t.number,
	someBoolean: t.boolean,
	nestedObject: t.type({
		innerString: t.string
	}),
	stringList: t.array(t.string),
	objectList: t.array( t.type({
		listedString: t.string
	})),
	nullableString: t.union([t.string, t.null]),
	optionalString: t.union([t.string, t.null, t.undefined])
})

type TT = t.TypeOf<typeof shape>
/*
describe("runtime-type-validation", () => {
	it ("ok thing is ok", () => {
		const ok = JSON.stringify({
			someString: "hi",
			someNumber: 1,
			someBoolean: true,
			nestedObject: {
				innerString: "hi again"
			},
			stringList: ["hi", "yo", "whatup"],
			objectList: [{listedString: "a"}, {listedString: "b"}, {listedString: "c"}],
			nullableString: "not null",
			optionalString: "its there"
		})
		const result = shape.decode(JSON.parse(ok))
		assert.ok(result.isRight())
	})
	it ("falsy ok thing is ok", () => {
		// falsy things
		const alsoOk = JSON.stringify({
			someString: "",
			someNumber: 0,
			someBoolean: false,
			nestedObject: {
				innerString: ""
			},
			stringList: ["", "", ""],
			objectList: [{listedString: ""}, {listedString: ""}, {listedString: ""}],
			nullableString: "",
			optionalString: ""
		})
		const result = shape.decode(JSON.parse(alsoOk))
		assert.ok(result.isRight())
	})
	it("missing string is error", () => {
		const missingString = JSON.stringify({
		//	someString: "hi",
			someNumber: 1,
			someBoolean: true,
			nestedObject: {
				innerString: "hi again"
			},
			stringList: ["hi", "yo", "whatup"],
			objectList: [{listedString: "a"}, {listedString: "b"}, {listedString: "c"}],
			nullableString: "not null",
			optionalString: "its there"
		})
		const result = shape.decode(JSON.parse(missingString))
		//const err = PathReporter.report(result)
		assert.ok(result.isLeft())
	})
	it("null reqd string is error", () => {
		const nullString = JSON.stringify({
			someString: null,
			someNumber: 1,
			someBoolean: true,
			nestedObject: {
				innerString: "hi again"
			},
			stringList: ["hi", "yo", "whatup"],
			objectList: [{listedString: "a"}, {listedString: "b"}, {listedString: "c"}],
			nullableString: "not null",
			optionalString: "its there"
		})
		const result = shape.decode(JSON.parse(nullString))
		const err = PathReporter.report(result)
		assert.ok(result.isLeft())
	})
	it("nested obj null is error", () => {
		const nullString = JSON.stringify({
			someString: "hi",
			someNumber: 1,
			someBoolean: true,
			nestedObject: null,
			stringList: ["hi", "yo", "whatup"],
			objectList: [{listedString: "a"}, {listedString: "b"}, {listedString: "c"}],
			nullableString: "not null",
			optionalString: "its there"
		})
		const result = shape.decode(JSON.parse(nullString))
		const err = PathReporter.report(result)
		assert.ok(result.isLeft())
	})
	it("nested obj empty obj/missing props is error", () => {
		const nullString = JSON.stringify({
			someString: "hi",
			someNumber: 1,
			someBoolean: true,
			nestedObject: {},
			stringList: ["hi", "yo", "whatup"],
			objectList: [{listedString: "a"}, {listedString: "b"}, {listedString: "c"}],
			nullableString: "not null",
			optionalString: "its there"
		})
		const result = shape.decode(JSON.parse(nullString))
		const err = PathReporter.report(result)
		assert.ok(result.isLeft())
	})
	it("nested obj extra props is ok", () => {
		const nullString = JSON.stringify({
			someString: "hi",
			someNumber: 1,
			someBoolean: true,
			nestedObject: {
				innerString: "hi again",
				extraProp: "i shouldnt be here"
			},
			stringList: ["hi", "yo", "whatup"],
			objectList: [{listedString: "a"}, {listedString: "b"}, {listedString: "c"}],
			nullableString: "not null",
			optionalString: "its there"
		})
		const result = shape.decode(JSON.parse(nullString))
		const err = PathReporter.report(result)
		assert.ok(result.isRight())
	})
	it("string list empty list is ok", () => {
		const nullString = JSON.stringify({
			someString: "hi",
			someNumber: 1,
			someBoolean: true,
			nestedObject: {
				innerString: "hi again"
			},
			stringList: [],
			objectList: [{listedString: "a"}, {listedString: "b"}, {listedString: "c"}],
			nullableString: "not null",
			optionalString: "its there"
		})
		const result = shape.decode(JSON.parse(nullString))
		const err = PathReporter.report(result)
		assert.ok(result.isRight())
	})
	it("string list null is error", () => {
		const nullString = JSON.stringify({
			someString: "hi",
			someNumber: 1,
			someBoolean: true,
			nestedObject: {
				innerString: "hi again"
			},
			stringList: null,
			objectList: [{listedString: "a"}, {listedString: "b"}, {listedString: "c"}],
			nullableString: "not null",
			optionalString: "its there"
		})
		const result = shape.decode(JSON.parse(nullString))
		const err = PathReporter.report(result)
		assert.ok(result.isLeft())
	})
	it("string list mixed types is error", () => {
		const nullString = JSON.stringify({
			someString: "hi",
			someNumber: 1,
			someBoolean: true,
			nestedObject: {
				innerString: "hi again"
			},
			stringList: ["1", 2],
			objectList: [{listedString: "a"}, {listedString: "b"}, {listedString: "c"}],
			nullableString: "not null",
			optionalString: "its there"
		})
		const result = shape.decode(JSON.parse(nullString))
		const err = PathReporter.report(result)
		assert.ok(result.isLeft())
	})
	it("nullable string null is ok", () => {
		const nullString = JSON.stringify({
			someString: "hi",
			someNumber: 1,
			someBoolean: true,
			nestedObject: {
				innerString: "hi again"
			},
			stringList: ["hi", "yo", "whatup"],
			objectList: [{listedString: "a"}, {listedString: "b"}, {listedString: "c"}],
			nullableString: null,
			optionalString: "its there"
		})
		const result = shape.decode(JSON.parse(nullString))
		const err = PathReporter.report(result)
		assert.ok(result.isRight())
	})
	it("nullable string not present is error", () => {
		const nullString = JSON.stringify({
			someString: "hi",
			someNumber: 1,
			someBoolean: true,
			nestedObject: {
				innerString: "hi again"
			},
			stringList: ["hi", "yo", "whatup"],
			objectList: [{listedString: "a"}, {listedString: "b"}, {listedString: "c"}],
		//	nullableString: null,
			optionalString: "its there"
		})
		const result = shape.decode(JSON.parse(nullString))
		const err = PathReporter.report(result)
		assert.ok(result.isLeft())
	})
	it("optional string null is ok", () => {
		const nullString = JSON.stringify({
			someString: "hi",
			someNumber: 1,
			someBoolean: true,
			nestedObject: {
				innerString: "hi again"
			},
			stringList: ["hi", "yo", "whatup"],
			objectList: [{listedString: "a"}, {listedString: "b"}, {listedString: "c"}],
			nullableString: "not null",
			optionalString: null
		})
		const result = shape.decode(JSON.parse(nullString))
		const err = PathReporter.report(result)
		assert.ok(result.isRight())
	})
	it("optional string not present is ok", () => {
		const nullString = JSON.stringify({
			someString: "hi",
			someNumber: 1,
			someBoolean: true,
			nestedObject: {
				innerString: "hi again"
			},
			stringList: ["hi", "yo", "whatup"],
			objectList: [{listedString: "a"}, {listedString: "b"}, {listedString: "c"}],
			nullableString: "not null",
	//		optionalString: "its there"
		})
		const result = shape.decode(JSON.parse(nullString))
		const err = PathReporter.report(result)
		assert.ok(result.isRight())
	})
})
*/