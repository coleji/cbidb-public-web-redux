import * as React from "react";
import { ConnectedComponentClass } from "react-redux";
import { RouteComponentProps, StaticContext, Route } from "react-router";
import { Dispatch } from "redux";
import { push } from "connected-react-router";

interface Props<T extends object> {
	dispatch: Dispatch,
	start: string,
	end: string,
	componentProps: (routeProps: RouteComponentProps<any, StaticContext, any>) => T,
	elements: {
		path: string,
		clazz: ConnectedComponentClass<any, any>
	}[]
}

export default class TransparentPageflow<T extends object> {
	routes: JSX.Element[]
	componentProps: (routeProps: RouteComponentProps<any, StaticContext, any>) => T
	getConcretePath = (path: string) => (componentProps: T) => {
		var ret = path
		for (let prop in componentProps) {
			console.log("path is " + ret)
			console.log(`trying to replace ${":" + prop} with ${String(componentProps[prop])}`)
			ret = ret.replace(":" + prop, String(componentProps[prop]))
		}
		console.log("done replacing:  " + ret)
		return ret;
	}
	constructor(props: Props<T>) {
		this.componentProps = props.componentProps
		this.routes = props.elements.map((e, i) => {
			const Clazz = e.clazz
			const next = i==props.elements.length-1 ? () => props.end : this.getConcretePath(props.elements[i+1].path)
			const prev = i==0 ? () => props.start : this.getConcretePath(props.elements[i-1].path)
			return (<Route
				key={e.path}
				path={e.path}
				render={(routeProps) => <Clazz
					{...this.componentProps(routeProps)}
					goNext={() => { props.dispatch(push(next(this.componentProps(routeProps)))) }}
					goPrev={() => { props.dispatch(push(prev(this.componentProps(routeProps)))) }}
				/>}
			/>)
		})
	}
}