abstract class Optional<T> {
	abstract get(): T
	abstract getFailFast(): T
	abstract getOrElse(t2: T): T
	abstract isDefined(): boolean
	abstract match<U>(m: {
		some: (t: T) => U,
		none: () => U
	}): U
}

class Optional_Some<T> extends Optional<T> {
	t: T
	constructor(t: T) {
		super();
		this.t = t;
	}
	get(): T {
		return this.t;
	}
	getFailFast(): T {
		return this.t;
	}
	getOrElse(t2: T): T {
		return this.t;
	}
	isDefined(): boolean {
		return true;
	}
	match<U>(m: {
		some: (t: T) => U,
		none: () => U
	}): U {
		return m.some(this.t);
	}
}

class Optional_None<T> extends Optional<T> {
	constructor() {
		super();
	}
	get(): T {
		return null;
	}
	getFailFast(): T {
		const err = "attempted to getFailFast() an unset optional";
		throw err;
	}
	getOrElse(t2: T): T {
		return t2;
	}
	isDefined(): boolean {
		return false;
	}
	match<U>(m: {
		some: (t: T) => U,
		none: () => U
	}): U {
		return m.none();
	}
}

function Some<T>(t: T): Optional_Some<T> {
	return new Optional_Some(t);
}

function None<T>(): Optional_None<T> {
	return new Optional_None<T>();
}