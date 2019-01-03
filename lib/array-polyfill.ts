interface Array<T> {
	// find(p: (t: T) => boolean): Optional<T>
	flatten<U>(): Array<U>
	zipWithIndex(): [T, number][]
}
	
// Array.prototype.find = function(p: any) {
// 	for (var i=0; i<this.length; i++) {
// 		if (p(this[i])) return Some(this[i]);
// 	}
// 	return None();
// }

Array.prototype.flatten = function() {
	return this.reduce(function(flattened: any, e: any) {
		if (e instanceof Array) flattened = flattened.concat(e);
		else flattened.push(e);
		return flattened;
	}, []);
}

Array.prototype.zipWithIndex = function() {
	return this.map((e: any, i: number) => [e, i]);
}