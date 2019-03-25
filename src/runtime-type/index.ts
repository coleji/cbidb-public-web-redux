export function validate<T>(spec: T) {

}

export function string(input: string): Promise<string> {
	return Promise.resolve(input);
}

export function number(input: string): Promise<number> {
	const asNumber = Number(input)
	if (isNaN(asNumber)) return Promise.reject("candidate number " + input + " was NaN")
	else return Promise.resolve(asNumber)
}