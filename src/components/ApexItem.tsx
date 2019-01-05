import * as React from "react";

export interface ApexItemProps<T> {
	id: string & keyof T,
	value: string,
	label?: string,
	extraCells?: React.ReactNode,
	innerRef?: React.RefObject<any>,
	appendToElementCell?: React.ReactNode,
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
	onEnter?: () => void,
	reduxAction?: (name: string, value: string) => void,
	justElement?: boolean
}

export abstract class ApexItem<T, U> extends React.PureComponent<U & ApexItemProps<T>> {
	element: React.ReactNode
	renderAsTableRow(): React.ReactNode {
		return (<tr>
			<td style={{ textAlign: "right" }}>
				<label id={this.props.id + "_LABEL"} htmlFor={this.props.id}>
					<span className="optional">{this.props.label || ""}</span>
				</label>
			</td>
			<td style={{ textAlign: "left" }}>
				{this.element}
				{this.props.appendToElementCell}
			</td>
			{this.props.extraCells ? <td>{this.props.extraCells}</td> : null}
		</tr>);
	}
	render() {
		return this.props.justElement
		? this.element
		: this.renderAsTableRow()
	}
}

