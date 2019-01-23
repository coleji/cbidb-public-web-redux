interface Array<T> {
	// find(p: (t: T) => boolean): Optional<T>
	flatten<U>(): Array<U>
	zipWithIndex(): [T, number][]
	grouped(size: number): T[][]
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

Array.prototype.grouped = function(size: number) {
	var groups = [];
	var group = [];
	for (var i=0; i<this.length; i++) {
		if (group.length >= size) {
			groups.push(group)
			group = [];
		}
		group.push(this[i]);
	}
	groups.push(group);
	return groups;
}