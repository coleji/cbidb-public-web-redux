import * as React from "react";
import { Field } from 'redux-form'

import TextInput from './TextInput';

interface Props<FormInput> {
	id: keyof FormInput,
	label?: string,
	isPassword: boolean,
	extraCells?: React.ReactNode,
	innerRef?: React.RefObject<any>,
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default class FormWrappedTextInput<FormInput> extends TextInput {
	constructor(props: Props<FormInput>) {
		super({...props, id: props.id as string})
	}
	render() {
		console.log("rendering the FormWrappedTextInput")
		return super.render();
	}
}