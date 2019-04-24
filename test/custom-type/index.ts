import * as t from 'io-ts'
import * as assert from "assert"
import { PathReporter } from 'io-ts/lib/PathReporter'

import {OptionalString, OptionalNumber, OptionalBoolean} from "../../src/util/OptionalTypeValidators"





const shape = t.type({
	s: OptionalString,
	n: OptionalNumber,
	b: OptionalBoolean
})

describe("OptionalString", () => {
	it("positive control", () => {
		assert.ok(true)
	})
	it("works for present", () => {
		const candidate = JSON.stringify({
			s: "hi",
			n: 12,
			b: true
		})
		const result = shape.decode(JSON.parse(candidate))
		const err = PathReporter.report(result)
		console.log(result.getOrElse(null))
		assert.ok(
			result.isRight() && 
			result.getOrElse(null).s.getOrElse(null) === "hi" && 
			result.getOrElse(null).n.getOrElse(null) === 12 && 
			result.getOrElse(null).b.getOrElse(null) === true
		)
	})
	it("works for falsy", () => {
		const candidate = JSON.stringify({
			s: "",
			n: 0,
			b: false
		})
		const result = shape.decode(JSON.parse(candidate))
		const err = PathReporter.report(result)
		assert.ok(
			result.isRight() && 
			result.getOrElse(null).s.getOrElse(null) === "" && 
			result.getOrElse(null).n.getOrElse(null) === 0 && 
			result.getOrElse(null).b.getOrElse(null) === false
		)
	})
	it("works for null", () => {
		const candidate = JSON.stringify({
			s: null,
			n: null,
			b: null
		})
		const result = shape.decode(JSON.parse(candidate))
		const err = PathReporter.report(result)
		assert.ok(
			result.isRight() && 
			result.getOrElse(null).s.isNone() && 
			result.getOrElse(null).n.isNone() && 
			result.getOrElse(null).b.isNone()
		)
	})
	it("works for undefined", () => {
		const candidate = JSON.stringify({ })
		const result = shape.decode(JSON.parse(candidate))
		const err = PathReporter.report(result)
		assert.ok(
			result.isRight() && 
			result.getOrElse(null).s.isNone() && 
			result.getOrElse(null).n.isNone() && 
			result.getOrElse(null).b.isNone()
		)
	})
})


type TT = t.TypeOf<typeof shape>