import * as React from "react";

interface Props {
	id: string,
	label?: string,
	isPassword: boolean,
	extraCells?: React.ReactNode,
	innerRef?: React.RefObject<any>,
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
	onEnter?: () => void,
	reduxAction?: (name: string, value: string) => void,
	value: string
}

export default class TextInput<T> extends React.PureComponent<Props & T> {
	render() {
		console.log("here i go rendering again")
		console.log(this.props)
		const onKeyPress = (e: React.KeyboardEvent) => {
			if (this.props.onEnter && (e.keyCode || e.which) == 13) {
				this.props.onEnter();
			}
		}
		const onChange = 
			this.props.reduxAction
			? (ev: React.ChangeEvent<HTMLInputElement>) => this.props.reduxAction(this.props.id, ev.target.value)
			: this.props.onChange
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
					onChange={onChange}
					onKeyPress={onKeyPress}
					value={this.props.value}
				/>

			</td>
	
			{this.props.extraCells ? <td>{this.props.extraCells}</td> : null}
		</tr>
	}
}

