import * as React from "react";
import * as t from 'io-ts'
import APIWrapper from "../async/APIWrapper";

export interface Props<T_Form, T_APIProps extends t.Props, T_APIValidator extends t.TypeC<T_APIProps>> {
	formName: string,
	getApiWrapper: APIWrapper<T_APIValidator, never, never>,
	apiToForm: (apiResult: t.TypeOf<T_APIValidator>) => T_Form,
	formToAPI: (formState: T_Form) => t.TypeOf<T_APIValidator>
}

export default abstract class OneWayDataComponent<T_Form, T_APIProps extends t.Props, T_APIValidator extends t.TypeC<T_APIProps>>
extends React.PureComponent<Props<T_Form, T_APIProps, T_APIValidator>> {
	abstract renderPlaceholder: () => JSX.Element
	abstract renderComponent: (data: T_Form) => JSX.Element
	constructor(props: Props<T_Form, T_APIProps, T_APIValidator>) {
		super(props)
	}
	render() {
		return <span>hi</span>
	}
}