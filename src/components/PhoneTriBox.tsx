import * as React from "react";

import {Select} from "./Select"
import TextInput from "./TextInput";

export interface PhoneTriBoxProps<U> {
    label: string,
    firstID: string & keyof U,
    secondID: string & keyof U,
    thirdID: string & keyof U,
    extID: string & keyof U,
    typeID: string & keyof U,
    firstValue: string,
    secondValue: string,
    thirdValue: string,
    extValue: string
    typeValue: string,
    reduxAction?: (name: string, value: string) => void,
    isRequired?: boolean
}


export default class PhoneTriBox<U, T extends PhoneTriBoxProps<U>> extends React.PureComponent<T> {
	render() {
        const self = this
        const second = <TextInput<U>
            id={self.props.secondID}
            value={self.props.secondValue}
            reduxAction={self.props.reduxAction}
            isRequired={self.props.isRequired}
            size={3}
            maxLength={3}
            justElement={true}
        />
        const third = <TextInput<U>
            id={self.props.thirdID}
            value={self.props.thirdValue}
            reduxAction={self.props.reduxAction}
            isRequired={self.props.isRequired}
            size={4}
            maxLength={4}
            justElement={true}
        />
        const ext = <TextInput<U>
            id={self.props.extID}
            value={self.props.extValue}
            reduxAction={self.props.reduxAction}
            isRequired={self.props.isRequired}
            size={5}
            justElement={true}
        />
        return (<React.Fragment>
            <TextInput<U>
                id={self.props.firstID}
                label={self.props.label}
                value={self.props.firstValue}
                reduxAction={self.props.reduxAction}
                isRequired={self.props.isRequired}
                size={3}
                maxLength={3}
                prependToElementCell="("
                appendToElementCell={(
                    <span>
                        {") - "}
                        {second}
                        {" - "}
                        {third}
                        {"  ext."}
                        {ext}
                    </span>
                )}
            />
            <Select<U>
                id={self.props.typeID}
                label="Type"
                isRequired={self.props.isRequired}
                value={self.props.typeValue}
                reduxAction={self.props.reduxAction}
                options={["Home", "Work", "Cell"].map(k => ({key: k, display: k}))}
                nullDisplay="- Select -"
            />
        </React.Fragment>);
	}
}