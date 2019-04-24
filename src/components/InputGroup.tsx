import * as React from "react";
import { ApexItem, ApexItemProps } from "./ApexItem";
import { Option } from "fp-ts/lib/Option";

interface KeyValuePair {
	key: string,
	display?: string | JSX.Element
}

interface Props {
	id: string,
    reduxAction?: (name: string, value: any) => void
	columns?: number
}

type PropsWithValues = Props & {
	values: KeyValuePair[]
}


// TODO: test pre-pop value from server state

// todo: checkbox needs to add or remove value from running agg, return new agg

abstract class InputGroup<T_Form, T_Props extends Props, T_ValueType> extends ApexItem<T_Form, T_Props & ApexItemProps<T_Form, T_ValueType>, T_ValueType> {
	abstract isCheckbox: boolean
	abstract onClick: (ev: React.ChangeEvent<HTMLInputElement>) => void;
	abstract values: KeyValuePair[]
    // private toggle(existingValues: string, newValue: string): string {
    //     const values = existingValues.split(this.props.delimiter);
        
    // }
    getElement() {
        const columns = this.props.columns || 1;

        console.log(this.isCheckbox)

        const group = this.isCheckbox ? "checkbox_group" : "radio_group"
        const apexItem = this.isCheckbox ? "apex-item-checkbox" : "apex-item-radio"
        const type = this.isCheckbox ? "checkbox" : "radio"

        return (<div id={this.props.id} className={group + " apex-item-group apex-item-group--rc " + apexItem}><div className={"apex-item-grid " + group}>
            {this.values.grouped(columns).map((cells, i) => {
                return <div className="apex-item-grid-row" key={"row_" + i}>
                    {cells.map(({key, display}) => (
                        <div className="apex-item-option" key={key}>
                            <input type={type} id={this.props.id + "_" + key} name={this.props.id} value={key} onChange={this.onClick} />
                            <label htmlFor={this.props.id + "_" + key}>{display == undefined ? key : display}</label>
                        </div>
                    ))}
                </div>
            })}
        </div></div>);
    }
}

export class RadioGroup<T_Form> extends InputGroup<T_Form, PropsWithValues, Option<string>> {
	isCheckbox = false;
	values = this.props.values;
	onClick = (ev: React.ChangeEvent<HTMLInputElement>) => this.props.reduxAction(this.props.id, ev.target.value);
}

export class CheckboxGroup<T_Form> extends InputGroup<T_Form, PropsWithValues, string[]> {
	isCheckbox = true;
	values = this.props.values;
	onClick = (ev: React.ChangeEvent<HTMLInputElement>) => {
		if (ev.target.checked) {
			this.props.reduxAction(this.props.id, (this.props.value || []).concat([ev.target.value]));
		} else {
			const newValues = this.props.value.filter(e => e != ev.target.value)
			this.props.reduxAction(this.props.id, newValues);
		}
	}
}

export class SingleCheckbox<T_Form> extends InputGroup<T_Form, Props, boolean> {
	isCheckbox = true;
	values = [{key: "isTrue", display: this.props.justElement ? this.props.label : ""}];
	onClick = (ev: React.ChangeEvent<HTMLInputElement>) => this.props.reduxAction(this.props.id, ev.target.checked);
}
