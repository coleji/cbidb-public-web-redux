import * as React from "react";

export interface ApexItemProps<T> {
	id: string & keyof T,
	value: string,
	label?: string,
	extraCells?: React.ReactNode,
	innerRef?: React.RefObject<any>,
	prependToElementCell?: React.ReactNode,
	appendToElementCell?: React.ReactNode,
	onChange?: (event: React.ChangeEvent) => void,
	onEnter?: () => void,
	reduxAction?: (name: string, value: string) => void,
	justElement?: boolean,
	isRequired?: boolean
}

export abstract class ApexItem<T, U> extends React.PureComponent<U & ApexItemProps<T>> {
	abstract getElement(): React.ReactNode
	renderAsTableRow(): React.ReactNode {
		return (<tr>
			<td style={{ textAlign: "right" }}>
				<label id={this.props.id + "_LABEL"} htmlFor={this.props.id}>
					{this.props.isRequired ? <img src="/images/required.png" alt="Value Required" tabIndex={999} />: ""}
					<span className="optional">{this.props.label || ""}</span>
				</label>
			</td>
			<td style={{ textAlign: "left" }}>
				{this.props.prependToElementCell}
				{this.getElement()}
				{this.props.appendToElementCell}
			</td>
			{this.props.extraCells ? <td>{this.props.extraCells}</td> : null}
		</tr>);
	}
	render() {
		return this.props.justElement
		? this.getElement()
		: this.renderAsTableRow()
	}
}

