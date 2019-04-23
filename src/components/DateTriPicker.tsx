import * as React from "react";

import {Select, KeyAndDisplay} from "./Select"
import range from "../util/range"
import * as moment from 'moment'

export interface DateTriPickerProps<U> {
	years: number[]
	monthID: string & keyof U,
	dayID: string & keyof U,
	yearID: string & keyof U,
	monthValue: string,
	dayValue: string,
	yearValue: string,
	reduxAction?: (name: string, value: string) => void,
	isRequired?: boolean,
	blurBox: boolean
}

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const leadingZero = (n: number) => n<10 ? String("0" + n) : String(n);

const dobMonthValues: KeyAndDisplay[] = months.map((m, i) => ({key: leadingZero(i+1), display: m}))

const days = range(1,31).map(i => ({key: String(leadingZero(i)), display: String(i)}))

export function componentsToDate(month: string, date: string, year: string): Optional<string> {
	if (
		isNaN(Number(month)) || isNaN(Number(date)) || isNaN(Number(year)) || 
		month == null || date == null || year == null
	) return None()
	const candidate = `${month}/${date}/${year}`
	const candidateMoment = moment(candidate, "MM/DD/YYYY");
	console.log(candidateMoment)
	if (candidateMoment.isValid()) return Some(candidate)
	else return None()
}

export default class DateTriPicker<U, T extends DateTriPickerProps<U>> extends React.PureComponent<T> {
	render() {
		const self = this
		console.log("here we go datePicker ", self.props)
		const dobDateAndYear = (function() {
			const date = <Select<U>
				id={self.props.dayID}
				justElement={true}
				value={self.props.dayValue}
				reduxAction={self.props.reduxAction}
				options={days}
				nullDisplay="- Day -"
			/>
			const year = <Select<U>
				id={self.props.yearID}
				justElement={true}
				value={self.props.yearValue}
				reduxAction={self.props.reduxAction}
				options={self.props.years.reverse().map(i => ({key: String(i), display: String(i)}))}
				nullDisplay="- Year -"
			/>

			return (
				<span>
					{" / "}
					{date}
					{" / "}
					{year}
				</span>
			)
		}());

		return <Select<U>
			id={self.props.monthID}
			label="Date of Birth"
			value={self.props.monthValue}
			reduxAction={self.props.reduxAction}
			options={dobMonthValues}
			appendToElementCell={self.props.blurBox ? null : dobDateAndYear}
			nullDisplay="- Month -"
			isRequired={self.props.isRequired}
			blurBox={self.props.blurBox}
		/>
	}
}