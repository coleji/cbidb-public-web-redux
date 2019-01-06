import * as React from "react";
import {ApexItemProps, ApexItem} from "./ApexItem"

interface Props {
	isPassword?: boolean
	size?: number
	maxLength?: number
}

export default class TextInput<T> extends ApexItem<T, Props & ApexItemProps<T>> {
	constructor(props: Props & ApexItemProps<T>) {
		super(props)
		const onKeyPress = (e: React.KeyboardEvent) => {
			if (this.props.onEnter && (e.keyCode || e.which) == 13) {
				this.props.onEnter();
			}
		}
		
		const onChange = 
			this.props.reduxAction
			? (ev: React.ChangeEvent<HTMLInputElement>) => this.props.reduxAction(this.props.id, ev.target.value)
			: this.props.onChange;
	
		this.element = <input 
			id={this.props.id} ref={this.props.innerRef}
			className="text_field apex-item-text"
			type={this.props.isPassword ? "password" : "text"}
			name={this.props.id}
			size={this.props.size || 25}
			maxLength={this.props.maxLength || 100}
			onChange={onChange}
			onKeyPress={onKeyPress}
			value={this.props.value}
		/>
	}
}

