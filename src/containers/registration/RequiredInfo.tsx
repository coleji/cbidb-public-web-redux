import * as React from "react";
import { connect } from "react-redux";
import * as moment from "moment";

import { RootState } from '../../reducer/rootReducer'
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import ProgressThermometer from "../../components/ProgressThermometer";
import TextInput from "../../components/TextInput";
import {formReducer, dispatchFormUpdate} from "../../form/form"
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaNotitleRegion from "../../theme/joomla/JoomlaNotitleRegion";
import {KeyAndDisplay, Select} from "../../components/Select"
import range from "../../util/range"
import DateTriPicker, {DateTriPickerProps} from "../../components/DateTriPicker"
import {states, countries} from "../../lov"
import PhoneTriBox, {PhoneTriBoxProps} from "../../components/PhoneTriBox";

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
	primaryPhoneExt: string,
	primaryPhoneType: string,
	alternatePhoneFirst: string,
	alternatePhoneSecond: string,
	alternatePhoneThird: string,
	alternatePhoneExt: string,
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

type Props = StateProps & DispatchProps & StaticProps;

class RequiredInfo extends React.PureComponent<Props> {
	render() {
		const self = this;
		const reduxAction = self.props.updateField;

		const thisYear = Number(self.props.getMoment().format("YYYY"))
		const years = range(thisYear-20, thisYear)

		// TODO: DOB constituent dropdowns could react to each others changes
		// e.g. pick day=31, then month=feb, day should blank out
		// TODO: Move the whole DOB thing into its own component
		const reqFields = (
			<table><tbody>
				<FormInput
					id="firstName"
					label="First Name"
					isRequired={true}
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
					isRequired={true}
					value={self.props.form.lastName}
					reduxAction={reduxAction}
				/>
				<DateTriPicker<Form, DateTriPickerProps<Form>>
					years={years}
					monthID="dobMonth"
					dayID="dobDate"
					yearID="dobYear"
					isRequired={true}
					monthValue={self.props.form.dobMonth}
					dayValue={self.props.form.dobDate}
					yearValue={self.props.form.dobYear}
					reduxAction={reduxAction}
				/>
				<FormInput
					id="childEmail"
					label="Child Email"
					value={self.props.form.childEmail}
					reduxAction={reduxAction}
				/>
				<tr>
					<td style={{ textAlign: "right" }}>
						<label>
							<span className="optional">Parent Email</span>
						</label>
					</td>
					<td style={{ textAlign: "left" }}>
						abcd@efg.com
					</td>
				</tr>
				<FormInput
					id="addr_1"
					label="Address 1"
					isRequired={true}
					value={self.props.form.addr_1}
					reduxAction={reduxAction}
				/>
				<FormInput
					id="addr_2"
					label="Address 2"
					value={self.props.form.addr_2}
					reduxAction={reduxAction}
				/>
				<FormInput
					id="addr_3"
					label="Address 3"
					value={self.props.form.addr_3}
					reduxAction={reduxAction}
				/>
				<FormInput
					id="city"
					label="City"
					isRequired={true}
					value={self.props.form.addr_2}
					reduxAction={reduxAction}
				/>
				<FormSelect
					id="state"
					label="State"
					isRequired={true}
					value={self.props.form.state}
					reduxAction={reduxAction}
					options={states}
					nullDisplay="- Select -"
				/>
				<FormInput
					id="zip"
					label="Zip"
					isRequired={true}
					value={self.props.form.zip}
					reduxAction={reduxAction}
				/>
				<FormSelect		// TODO: default to US
					id="country"
					label="Country"
					isRequired={true}
					value={self.props.form.country}
					reduxAction={reduxAction}
					options={countries}
					nullDisplay="- Select -"
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Parent Primary Phone"
					firstID="primaryPhoneFirst"
					secondID="primaryPhoneSecond"
					thirdID="primaryPhoneThird"
					extID="primaryPhoneExt"
					typeID="primaryPhoneType"
					firstValue={self.props.form.primaryPhoneFirst}
					secondValue={self.props.form.primaryPhoneSecond}
					thirdValue={self.props.form.primaryPhoneThird}
					extValue={self.props.form.primaryPhoneExt}
					typeValue={self.props.form.primaryPhoneType}
					reduxAction={reduxAction}
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Parent Alternate Phone"
					firstID="alternatePhoneFirst"
					secondID="alternatePhoneSecond"
					thirdID="alternatePhoneThird"
					extID="alternatePhoneExt"
					typeID="alternatePhoneType"
					firstValue={self.props.form.alternatePhoneFirst}
					secondValue={self.props.form.alternatePhoneSecond}
					thirdValue={self.props.form.alternatePhoneThird}
					extValue={self.props.form.alternatePhoneExt}
					typeValue={self.props.form.alternatePhoneType}
					reduxAction={reduxAction}
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
		updateField: (name: keyof Form, value: string) => {
			console.log("updating field!")
			dispatchFormUpdate(dispatch, FORM_NAME)(name, value)
		}
	})
)(RequiredInfo)