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
    firstValue: Optional<string>,
    secondValue: Optional<string>,
    thirdValue: Optional<string>,
    extValue: Optional<string>
    typeValue: Optional<string>,
    reduxAction?: (name: string, value: string) => void,
    isRequired?: boolean,
	blurBox?: boolean
}

export const splitPhone = (phone: Optional<string>) => phone.match({
	some: p => ({
		first: Some(p.substr(1,3)),
		second: Some(p.substr(4,3)),
		third: Some(p.substr(7,3)),
		ext: Some(p.substr(10))
	}),
	none: () => ({
		first: None() as Optional<string>,
		second: None() as Optional<string>,
		third: None() as Optional<string>,
		ext: None() as Optional<string>
	})
})

export const combinePhone = (
	first: Optional<string>,
	second: Optional<string>,
	third: Optional<string>,
	ext:  Optional<string>
) => {
	if (
		!first.isDefined() && 
		!second.isDefined() && 
		!third.isDefined() && 
		!ext.isDefined()
	) {
		return None() as Optional<string>;
	} else {
		return Some([
			first.getOrElse(""),
			second.getOrElse(""),
			third.getOrElse(""),
			ext.getOrElse("")
		].join(""))
	}
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
        return self.props.blurBox ? (
			<TextInput<U>
                id={self.props.firstID}
                label={self.props.label}
                value={self.props.firstValue}
                reduxAction={self.props.reduxAction}
                isRequired={self.props.isRequired}
                size={3}
				maxLength={3}
				blurBox={self.props.blurBox}
            />
		) : (<React.Fragment>
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