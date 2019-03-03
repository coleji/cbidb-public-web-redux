import * as t from 'io-ts'
import register from "../manager"

const cacheName = "juniorRequired";

const validator = t.interface({
	nameFirst: t.string,
	nameLast: t.string,
	nameMiddleInitial: t.string
})

type ApiResponseShape = t.TypeOf<typeof validator>;

type State = {
	[K: number]: ApiResponseShape
}

const {dispatchWrapper, waiting, success, failed} = register(cacheName);

export function get(dispatch: any, makeAPIRequest: any, personId: Number) {
	dispatchWrapper(dispatch, waiting)
	makeAPIRequest("/junior/required")
	.then((result: any) => {
		dispatchWrapper(dispatch, success(result))
	})
	.catch((err: any) => {
		dispatchWrapper(dispatch, failed)
	})
}

export const reducer: (state: State, action: any) => State = (state, action) => state
