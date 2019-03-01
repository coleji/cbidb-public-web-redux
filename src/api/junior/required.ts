import * as t from 'io-ts'
import { makeAPIRequest } from '../../async/async';

const validator = t.interface({
	nameFirst: t.string,
	nameLast: t.string,
	nameMiddleInitial: t.string
})

type Shape = t.TypeOf<typeof validator>;

export function get(juniorId: number): Promise<Shape> {
	return new Promise((resolve, reject) => {

	})
}