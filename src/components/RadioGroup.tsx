import * as React from "react";
import { ApexItem, ApexItemProps } from "./ApexItem";

interface Props {
    id: string,
    values: {key: string, display: string}[],
    reduxAction?: (name: string, value: string) => void
}

// TODO: test pre-pop value from server state

class RadioGroup<T> extends ApexItem<T, Props & ApexItemProps<T>> {
    getElement() {
        const onClick = (ev: React.ChangeEvent<HTMLInputElement>) => {
            console.log("clicked a radio!", ev.target)
            this.props.reduxAction(this.props.id, ev.target.value)
        }
        return (<div id={this.props.id} className="radio_group apex-item-group apex-item-group--rc apex-item-radio">
            {this.props.values.map(({key, display}) => (
                <div className="apex-item-option" key={key}>
                    <input type="radio" id={this.props.id + "_" + key} name={this.props.id} value={key} onChange={onClick} />
                    <label htmlFor={this.props.id + "_" + key}>{display}</label>
                </div>
            ))}
        </div>);
    }
}

export default class RadioGroupWrapper<T> extends React.PureComponent<Props & ApexItemProps<T>> {
    render() {
        return <RadioGroup justElement={true} {...this.props}/>
    }
}