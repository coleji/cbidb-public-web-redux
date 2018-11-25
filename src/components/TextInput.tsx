import * as React from "react";

interface Props {
	id: string,
	label?: string,
	value: string,
	isPassword: boolean,
	extraCells?: React.ReactNode,
	innerRef?: React.RefObject<any>
}

export default class TextInput extends React.PureComponent<Props> {
	render() {
		return <tr>
			<td style={{ textAlign: "right" }}>
				<label id={this.props.id + "_LABEL"} htmlFor={this.props.id}>
					<span className="optional">{this.props.label || ""}</span>
				</label>
			</td>
			<td style={{ textAlign: "left" }}>
				<input 
					id={this.props.id} ref={this.props.innerRef} className="text_field apex-item-text"
					type={this.props.isPassword ? "password" : "text"} name={this.props.id}
					size={25} maxLength={100} defaultValue={this.props.value}
				/>
			</td>
			{this.props.extraCells ? <td>{this.props.extraCells}</td> : null}
		</tr>
	}
}

