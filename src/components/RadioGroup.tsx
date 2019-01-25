import * as React from "react";
import { ApexItem, ApexItemProps } from "./ApexItem";

interface Props {
    id: string,
    values: {key: string, display?: string}[],
    reduxAction?: (name: string, value: string) => void
    columns?: number,
  //  delimiter: string             // TODO
}


// TODO: test pre-pop value from server state

// todo: checkbox needs to add or remove value from running agg, return new agg

abstract class InputGroup<T> extends ApexItem<T, Props & ApexItemProps<T>> {
    abstract isCheckbox: boolean
    // private toggle(existingValues: string, newValue: string): string {
    //     const values = existingValues.split(this.props.delimiter);
        
    // }
    getElement() {
        const onClick = (ev: React.ChangeEvent<HTMLInputElement>) => this.props.reduxAction(this.props.id, ev.target.value)
        const columns = this.props.columns || 1;

        console.log(this.isCheckbox)

        const group = this.isCheckbox ? "checkbox_group" : "radio_group"
        const apexItem = this.isCheckbox ? "apex-item-checkbox" : "apex-item-radio"
        const type = this.isCheckbox ? "checkbox" : "radio"

        return (<div id={this.props.id} className={group + " apex-item-group apex-item-group--rc " + apexItem}><div className={"apex-item-grid " + group}>
            {this.props.values.grouped(columns).map((cells, i) => {
                return <div className="apex-item-grid-row" key={"row_" + i}>
                    {cells.map(({key, display}) => (
                        <div className="apex-item-option" key={key}>
                            <input type={type} id={this.props.id + "_" + key} name={this.props.id} value={key} onChange={onClick} />
                            <label htmlFor={this.props.id + "_" + key}>{display || key}</label>
                        </div>
                    ))}
                </div>
            })}
        </div></div>);
    }
}

export class RadioGroup<T> extends InputGroup<T> {
    isCheckbox = false;
}

export class CheckboxGroup<T> extends InputGroup<T> {
    isCheckbox = true;
}