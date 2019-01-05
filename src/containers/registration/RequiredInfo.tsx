import * as React from "react";
import { connect } from "react-redux";

import { RootState } from '../../reducer/rootReducer'
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import ProgressThermometer from "../../components/ProgressThermometer";
import TextInput from "../../components/TextInput";
import {formReducer, dispatchFormUpdate} from "../../form/form"
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaNotitleRegion from "../../theme/joomla/JoomlaNotitleRegion";
import {KeyAndDisplay, Select} from "../../components/Select"
import range from "../../util/range"
import * as moment from "moment";

export const FORM_NAME = "registrationRequiredInfo"

export interface Form {
	firstName: string
	middleInitial: string
	lastName: string,
	dobMonth: string,
	dobDate: string,
	dobYear: string,
	childEmail: string,
	addr_1: string,
	addr_2: string,
	addr_3: string,
	city: string,
	state: string,
	zip: string,
	country: string,
	primaryPhoneFirst: string,
	primaryPhoneSecond: string,
	primaryPhoneThird: string,
	primaryPhoneType: string,
	alternatePhoneFirst: string,
	alternatePhoneSecond: string,
	alternatePhoneThird: string,
	alternatePhoneType: string,
	allergies: string,
	medications: string,
	specialNeeds: string
	
}


class FormInput extends TextInput<Form> {}
class FormSelect extends Select<Form> {}

interface StateProps {
	form: Form,
	getMoment: () => moment.Moment
}

interface DispatchProps {
	updateField: (name: keyof Form, value: string) => void
}

interface StaticProps { }

type Props = StateProps & DispatchProps & StaticProps

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const leadingZero = (n: number) => n<10 ? String("0" + n) : String(n);

const dobMonthValues: KeyAndDisplay[] = months.map((m, i) => ({key: leadingZero(i+1), display: m}))

const days = range(1,31).map(i => ({key: String(i), display: String(i)}))

class RequiredInfo extends React.PureComponent<Props> {
	render() {
		const self = this;
		const reduxAction = self.props.updateField;

		const dobDateAndYear = (function() {
			const thisYear = Number(self.props.getMoment().format("YYYY"))
			const years = range(thisYear-20, thisYear).reverse().map(i => ({key: String(i), display: String(i)}))
			const date = <FormSelect
				id="dobDate"
				justElement={true}
				value={self.props.form.dobMonth}
				reduxAction={reduxAction}
				options={days}
				nullDisplay="- Day -"
			/>
			const year = <FormSelect
				id="dobYear"
				justElement={true}
				value={self.props.form.dobMonth}
				reduxAction={reduxAction}
				options={years}
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

		// TODO: DOB constituent dropdowns could react to each others changes
		// e.g. pick day=31, then month=feb, day should blank out
		// TODO: Move the whole DOB thing into its own component
		const reqFields = (
			<table><tbody>
				<FormInput
					id="firstName"
					label="First Name"
					value={self.props.form.firstName}
					reduxAction={reduxAction}
				/>
				<FormInput
					id="middleInitial"
					label="Middle Initial"
					value={self.props.form.middleInitial}
					reduxAction={reduxAction}
				/>
				<FormInput
					id="lastName"
					label="Last Initial"
					value={self.props.form.lastName}
					reduxAction={reduxAction}
				/>
				<FormSelect
					id="dobMonth"
					label="Date of Birth"
					value={self.props.form.dobMonth}
					reduxAction={reduxAction}
					options={dobMonthValues}
					appendToElementCell={dobDateAndYear}
					nullDisplay="- Month -"
				/>
			</tbody></table>
		)
		return <JoomlaMainPage>
			<JoomlaNotitleRegion>
				<ProgressThermometer />
			</JoomlaNotitleRegion>
			<JoomlaArticleRegion title="All information on this page is required (if applicable).">
				{reqFields}
			</JoomlaArticleRegion>
		</JoomlaMainPage>
	}
}

export default connect<StateProps, DispatchProps, StaticProps, RootState>(
	state => ({
		getMoment: state.getMoment,
		form: {
			...state.registrationRequiredInfoForm
		}
	}),
	dispatch => ({
		updateField: (name: keyof Form, value: string) => dispatchFormUpdate(dispatch, FORM_NAME)(name, value)
	})
)(RequiredInfo)