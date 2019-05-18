import * as assert from "assert"
import { DoublyLinkedList } from '../../src/util/DoublyLinkedList';

const l = DoublyLinkedList.from([1,2,3,4,5,6,7,8])

describe("DoublyLinkedList", () => {
	it("one next", () => {
		assert.deepEqual(l.next(), new DoublyLinkedList([1], 2, [3,4,5,6,7,8]))
	})
	it("two next", () => {
		assert.deepEqual(l.next().next(), new DoublyLinkedList([1,2], 3, [4,5,6,7,8]))
	})
	it("all the next", () => {
		assert.deepEqual(l.next().next().next().next().next().next().next().next().next().next().next(), new DoublyLinkedList([1,2,3,4,5,6,7], 8, []))
	})
	it("NP cancels", () => {
		assert.deepEqual(l.next().next().prev(), l.next())
	})
	it("PN cancels", () => {
		const ll = l.next().next()
		assert.deepEqual(ll.prev().next(), ll)
	})
	it("supports singleton", () => {
		const ll = DoublyLinkedList.from([1])
		assert.equal(ll.curr, 1)
	})
})