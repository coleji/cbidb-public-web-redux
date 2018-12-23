import * as React from "react";

import TextInput from './TextInput';

interface Props<T> {
	id: string & keyof T,
	label?: string,
	isPassword: boolean,
	extraCells?: React.ReactNode,
	innerRef?: React.RefObject<any>,
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
	onEnter?: () => void,
	reduxAction?: (name: string, value: string) => void,
	value: string
}

export default class FormWrappedTextInput<T> extends TextInput<Props<T>> {
	constructor(props: Props<T>) {
		super({...props, id: props.id})
	}
	render() {
		console.log("rendering the FormWrappedTextInput")
		return super.render();
	}
}
