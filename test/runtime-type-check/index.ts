import * as t from 'io-ts'
import { PathReporter } from 'io-ts/lib/PathReporter'
import * as assert from "assert"

const innerObjShape = t.type({
	innerString: t.string
})

const listObjShape = t.type({
	listedString: t.string
})

const shape = t.type({
	someString: t.string,
	someNumber: t.number,
	someBoolean: t.boolean,
	nestedObject: innerObjShape,
	stringList: t.array(t.string),
	objectList: t.array(listObjShape)
	//optionalString: t.union([t.string, t.null])
})

const ok = JSON.stringify({
	someString: "hi",
	someNumber: 1,
	someBoolean: true,
	stringList: ["hi", "yo", "whatup"],
	objectList: [{listedString: "a"}, {listedString: "b"}, {listedString: "c"}],
	nestedObject: {
		innerString: "hi again"
	}
})

// falsy things
const alsoOk = JSON.stringify({
	someString: "",
	someNumber: 0,
	someBoolean: false,
	stringList: ["hi", "yo", "whatup"],
	objectList: [{listedString: "a"}, {listedString: "b"}, {listedString: "c"}],
	nestedObject: {
		innerString: "hi again"
	}
})

const missingString = JSON.stringify({
	someNumber: 1,
	someBoolean: true,
	stringList: ["hi", "yo", "whatup"],
	objectList: [{listedString: "a"}, {listedString: "b"}, {listedString: "c"}],
	nestedObject: {
		innerString: "hi again"
	}
})

const nullString = JSON.stringify({
	someString: null,
	someNumber: 1,
	someBoolean: true,
	stringList: ["hi", "yo", "whatup"],
	objectList: [{listedString: "a"}, {listedString: "b"}, {listedString: "c"}],
	nestedObject: {
		innerString: "hi again"
	}
})

describe("runtime-type-validation", () => {
	it ("ok thing is ok", () => {
		const result = shape.decode(JSON.parse(ok))
		assert.ok(result.isRight())
	})
	it ("falsy ok thing is ok", () => {
		const result = shape.decode(JSON.parse(alsoOk))
		assert.ok(result.isRight())
	})
	it("missing string is error", () => {
		const result = shape.decode(JSON.parse(missingString))
		//const err = PathReporter.report(result)
		assert.ok(result.isLeft())
	})
	it("null string is error", () => {
		const result = shape.decode(JSON.parse(nullString))
		const err = PathReporter.report(result)
		console.log(err)
		assert.ok(result.isLeft())
	})
})