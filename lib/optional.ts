abstract class Optional<T> {
	abstract flatMap<U>(f: (t: T) => Optional<U>): Optional<U>
	abstract forEach(f: (t:T) => void): void
	abstract get(): T
	abstract getFailFast(): T
	abstract getOrElse(t2: T): T
	abstract isDefined(): boolean
	abstract map<U>(f: (t:T) => U): Optional<U>
	abstract match<U>(m: {
		some: (t: T) => U,
		none: () => U
	}): U
	abstract orNull(): T
}

class Optional_Some<T> extends Optional<T> {
	t: T
	constructor(t: T) {
		super();
		this.t = t;
	}
	flatMap<U>(f: (t: T) => Optional<U>): Optional<U> {
		return f(this.t)
	}
	forEach(f: (t:T) => void): void {
		f(this.t);
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
	map<U>(f: (t:T) => U): Optional<U> {
		return Some(f(this.t))
	}
	match<U>(m: {
		some: (t: T) => U,
		none: () => U
	}): U {
		return m.some(this.t);
	}
	orNull(): T {
		return this.t
	}
}

class Optional_None<T> extends Optional<T> {
	constructor() {
		super();
	}
	flatMap<U>(f: (t: T) => Optional<U>): Optional<U> {
		return None()
	}
	forEach(f: (t:T) => void): void {
		// do nothing
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
	map<U>(f: (t:T) => U): Optional<U> {
		return None();
	}
	match<U>(m: {
		some: (t: T) => U,
		none: () => U
	}): U {
		return m.none();
	}
	orNull(): T {
		return null;
	}
}

function Some<T>(t: T): Optional_Some<T> {
	return new Optional_Some(t);
}

function None(): Optional_None<never> {
	return new Optional_None<never>();
}

try {
	if (global) {
		var g = (<any>global)
		g.Some = Some
		g.None = None
		// g.Optional_Some = Optional_Some
		// g.Optional_None = Optional_None
	}
} catch (e) {}

try {
	if (window) {
		var w = (<any>window)
		w.Some = Some
		w.None = None
		// w.Optional_Some = Optional_Some
		// w.Optional_None = Optional_None
	}
} catch (e) {}
