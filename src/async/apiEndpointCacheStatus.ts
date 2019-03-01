export const UNINITIALIZED = {
	status: "UNINITIALIZED"
}

export const WAITING = {
	status: "WAITING"
}

export interface READY<T> {
	status: "READY",
	value: T
}

export const FAILED = {
	status: "FAILED"
}

export type ApiEndpointCacheStatus<T> = 
	| typeof UNINITIALIZED
	| typeof WAITING
	| READY<T>
	| typeof FAILED
