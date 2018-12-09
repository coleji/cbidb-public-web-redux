import * as React from "react";

// A React PureComponent with one twist
// Any changes in `props.form` are ignored when checking if the component should update
// `props.form` should contain only the components own form elements

const PROP_NAME_TO_IGNORE = "form";

export default class PureComponentIgnoreForm<Props> extends React.PureComponent<Props> {
	shouldComponentUpdate(nextProps: any, nextState: any, nextContext: any) {
		const superResult = super.shouldComponentUpdate ? super.shouldComponentUpdate(nextProps, nextState, nextContext) : true;
		if (!superResult) return false;
		else {
			var props: any = {};
			for (var p in this.props) props[p] = true
			for (var p in nextProps) props[p] = true
			for (var p in props) {
				if (p == PROP_NAME_TO_IGNORE) continue;
				if (!shallowEqual((this.props as any)[p], nextProps[p])) return true;
			}
			return false;
		}
		function shallowEqual(objA: any, objB: any): boolean {
			if (objA === objB) {
			  return true;
			}
		  
			if (typeof objA !== 'object' || objA === null ||
				typeof objB !== 'object' || objB === null) {
			  return false;
			}
		  
			var keysA = Object.keys(objA);
			var keysB = Object.keys(objB);
		  
			if (keysA.length !== keysB.length) {
			  return false;
			}
		  
			// Test for A's keys different from B.
			var bHasOwnProperty = Object.hasOwnProperty.bind(objB);
			for (var i = 0; i < keysA.length; i++) {
			  if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
				return false;
			  }
			}
		  
			return true;
		  }
	}
}