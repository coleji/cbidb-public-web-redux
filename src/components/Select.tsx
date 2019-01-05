import * as React from "react";
import {ApexItem, ApexItemProps} from "./ApexItem";

export interface KeyAndDisplay {
	key: string,
	display: string
}

interface Props {
	options: KeyAndDisplay[],
	nullDisplay?: string
}

export class Select<T> extends ApexItem<T, Props & ApexItemProps<T>> {
	constructor(props: Props & ApexItemProps<T>) {
		super(props)

		const onChange = (ev: React.ChangeEvent<HTMLSelectElement>) => this.props.reduxAction(this.props.id, ev.target.value);

		const nullOption: React.ReactNode[] = this.props.nullDisplay === undefined
		? []
		: [<option key={null}>{this.props.nullDisplay}</option>];

		this.element = (<select
			id={this.props.id}
			name={this.props.id}
			className="selectlist apex-item-select"
			onChange={onChange}
		>
			{nullOption.concat(this.props.options.map(({key, display}) => <option value={key} key={key}>{display}</option>))}
		</select>);
	}
}

