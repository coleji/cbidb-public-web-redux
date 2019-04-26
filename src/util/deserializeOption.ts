import { none, some } from "fp-ts/lib/Option";

function replaceWithOption(x: any): any {
	switch (typeof(x)) {
	case "number":
	case "string":
	case "boolean":
	case "undefined":
	case "function":
		return x;
	case "object":
		if (x === null) return x;
		else if (x instanceof Array) {
			return x.map(e => replaceWithOption(e))
		}
		else if (x["_tag"] && x["_tag"] == "None") {
			return none;
		} else if (x["_tag"] && x["_tag"] == "Some" && x["value"]) {
			return some(x["value"])
		} else {
			var ret: any = {};
			for (var p in x) {
				ret[p] = replaceWithOption(x[p]);
			}
			return ret;
		}
	}
}

export default replaceWithOption