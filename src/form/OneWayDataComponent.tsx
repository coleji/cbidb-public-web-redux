import * as React from "react";
import * as t from 'io-ts'
import APIWrapper from "../async/APIWrapper";
import { Option } from "fp-ts/lib/Option";

export default abstract class OneWayDataComponent<T_Props, T_Form, T_APIValidator extends t.Any>
extends React.PureComponent<T_Props> {
	abstract getData: () => Option<T_Form>
	abstract formName: string
	abstract getApiWrapper: APIWrapper<T_APIValidator, any, any>
	abstract apiToForm: (apiResult: t.TypeOf<T_APIValidator>) => T_Form
	abstract formToAPI: (formState: T_Form) => t.TypeOf<T_APIValidator>
	abstract renderPlaceholder(): JSX.Element
	abstract renderComponent(data: T_Form): JSX.Element
	constructor(props: T_Props) {
		super(props)
	}
	render() {
		return this.getData().isSome() ? this.renderComponent(this.getData().getOrElse(null)) : this.renderPlaceholder()
	}
}