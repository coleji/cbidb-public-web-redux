import * as t from 'io-ts'
import { PathReporter } from 'io-ts/lib/PathReporter'
import * as assert from "assert"

const shape = t.type({
	someString: t.string,
	someNumber: t.number,
	someBoolean: t.boolean,
	optionalString: t.union([t.string, t.null])
})

const ok = JSON.stringify({
	"someString": "hi",
	"someNumber": 1,
	"someBoolean": true
})

// falsy things
const alsoOk = JSON.stringify({
	"someString": "",
	"someNumber": 0,
	"someBoolean": false
})

const missingString = JSON.stringify({
	"someNumber": 1,
	"someBoolean": true
})

const nullString = JSON.stringify({
	"someString": null,
	"someNumber": 1,
	"someBoolean": true
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