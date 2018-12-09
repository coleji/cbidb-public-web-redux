import * as React from "react";

interface WithFormName {
	formName: string
}

// A pure component initialized with a `formName` string,
// and on update, if `store.updatedFormName` == my name, don't update,
// else call the react PureComponent shouldComponentUpdate() (pasted in from react source)
export default class PureComponentIgnoreForm<Props extends WithFormName> extends React.Component<Props> {
	shouldComponentUpdate(nextProps: any, nextState: any) {
		if (nextProps.updatedFormName == this.props.formName) return false;
		else return this.superShouldComponentUpdate(nextProps, nextState)
	}

	// Paste in all the Pure sCU shit from react
	superShouldComponentUpdate(nextProps: any, nextState: any): boolean {
		return this.shallowCompare(this, nextProps, nextState);
	}

	shallowEqual(objA: any, objB: any): boolean {
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
	  
	  shallowCompare(instance: any, nextProps: any, nextState: any) {
		return (
		  !this.shallowEqual(instance.props, nextProps) ||
		  !this.shallowEqual(instance.state, nextState)
		);
	  }
}