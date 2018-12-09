import * as React from "react";

interface Props {
	id: string,
	label?: string,
	isPassword: boolean,
	extraCells?: React.ReactNode,
	innerRef?: React.RefObject<any>,
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default class TextInput extends React.PureComponent<Props> {
	render() {
		console.log("here i go rendering again")
		console.log(this.props)
		return <tr>
			<td style={{ textAlign: "right" }}>
				<label id={this.props.id + "_LABEL"} htmlFor={this.props.id}>
					<span className="optional">{this.props.label || ""}</span>
				</label>
			</td>
			<td style={{ textAlign: "left" }}>
			{/*}
				<Field id={this.props.id} name={this.props.id} className="text_field apex-item-text" component="input"
				type={this.props.isPassword ? "password" : "text"} size={25} maxLength={100}
				/>
	{*/}
				<input 
					id={this.props.id} ref={this.props.innerRef} className="text_field apex-item-text"
					type={this.props.isPassword ? "password" : "text"} name={this.props.id}
					size={25} maxLength={100}
					onChange={this.props.onChange}
				/>

			</td>
	
			{this.props.extraCells ? <td>{this.props.extraCells}</td> : null}
		</tr>
	}
}

