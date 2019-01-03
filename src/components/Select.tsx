import * as React from "react";

export interface KeyAndDisplay {
	key: string,
	display: string
}

interface Props<T> {
	id: string & keyof T,
	label?: string,
	extraCells?: React.ReactNode,
	innerRef?: React.RefObject<any>,
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
	reduxAction?: (name: string, value: string) => void,
	value: string,
	options: KeyAndDisplay[]
}

export class Select<T> extends React.PureComponent<Props<T>> {
	render() {
		const onChange = 
			this.props.reduxAction
			? (ev: React.ChangeEvent<HTMLInputElement>) => this.props.reduxAction(this.props.id, ev.target.value)
			: this.props.onChange
		return (<tr>
			<td style={{ textAlign: "right" }}>
				<label id={this.props.id + "_LABEL"} htmlFor={this.props.id}>
					<span className="optional">{this.props.label || ""}</span>
				</label>
			</td>
			<td style={{ textAlign: "left" }}>
				{/* <input 
					id={this.props.id} ref={this.props.innerRef} className="text_field apex-item-text"
					type={this.props.isPassword ? "password" : "text"} name={this.props.id}
					size={25} maxLength={100}
					onChange={onChange}
					value={this.props.value}
				/> */}
				<select id={this.props.id} name={this.props.id} className="selectlist apex-item-select">
					{this.props.options.map(({key, display}) => {
						<option value={key}>{display}</option>
					})}
				</select>
			</td>
			{this.props.extraCells ? <td>{this.props.extraCells}</td> : null}
		</tr>);
	}
}

