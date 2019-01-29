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
import TextArea from "../../components/TextArea";

export const FORM_NAME = "emergencyContact"

export interface Form {
	emerg1Name: string,
	emerg1Relation: string,
	emerg1PrimaryPhoneFirst: string,
	emerg1PrimaryPhoneSecond: string,
	emerg1PrimaryPhoneThird: string,
	emerg1PrimaryPhoneExt: string,
	emerg1PrimaryPhoneType: string,

	emerg1AlternatePhoneFirst: string,
	emerg1AlternatePhoneSecond: string,
	emerg1AlternatePhoneThird: string,
	emerg1AlternatePhoneExt: string,
	emerg1AlternatePhoneType: string,

	emerg2Name: string,
	emerg2Relation: string,
	emerg2PrimaryPhoneFirst: string,
	emerg2PrimaryPhoneSecond: string,
	emerg2PrimaryPhoneThird: string,
	emerg2PrimaryPhoneExt: string,
	emerg2PrimaryPhoneType: string,

	emerg2AlternatePhoneFirst: string,
	emerg2AlternatePhoneSecond: string,
	emerg2AlternatePhoneThird: string,
	emerg2AlternatePhoneExt: string,
	emerg2AlternatePhoneType: string,
}

class FormInput extends TextInput<Form> {}
class FormSelect extends Select<Form> {}

interface StateProps {
	form: Form
}

interface DispatchProps {
	updateField: (name: keyof Form, value: string) => void
}

interface StaticProps { }

type Props = StateProps & DispatchProps & StaticProps;

class EmergencyContact extends React.PureComponent<Props> {
	render() {
		const self = this;
		const reduxAction = self.props.updateField;

		const emergFields = (
			<table><tbody>
				<FormInput
					id="emerg1Name"
					label="Emergency Contact #1 Name"
					isRequired={true}
					value={self.props.form.emerg1Name}
					reduxAction={reduxAction}
				/>
				<FormInput
					id="emerg1Relation"
					label="Relation"
					isRequired={true}
					value={self.props.form.emerg1Relation}
					reduxAction={reduxAction}
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Primary Phone"
					isRequired={true}
					firstID="emerg1PrimaryPhoneFirst"
					secondID="emerg1PrimaryPhoneSecond"
					thirdID="emerg1PrimaryPhoneThird"
					extID="emerg1PrimaryPhoneExt"
					typeID="emerg1PrimaryPhoneType"
					firstValue={self.props.form.emerg1PrimaryPhoneFirst}
					secondValue={self.props.form.emerg1PrimaryPhoneSecond}
					thirdValue={self.props.form.emerg1PrimaryPhoneThird}
					extValue={self.props.form.emerg1PrimaryPhoneExt}
					typeValue={self.props.form.emerg1PrimaryPhoneType}
					reduxAction={reduxAction}
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Alternate Phone"
					firstID="emerg1AlternatePhoneFirst"
					secondID="emerg1AlternatePhoneSecond"
					thirdID="emerg1AlternatePhoneThird"
					extID="emerg1AlternatePhoneExt"
					typeID="emerg1AlternatePhoneType"
					firstValue={self.props.form.emerg1AlternatePhoneFirst}
					secondValue={self.props.form.emerg1AlternatePhoneSecond}
					thirdValue={self.props.form.emerg1AlternatePhoneThird}
					extValue={self.props.form.emerg1AlternatePhoneExt}
					typeValue={self.props.form.emerg1AlternatePhoneType}
					reduxAction={reduxAction}
				/>
				<FormInput
					id="emerg2Name"
					label="Emergency Contact #2 Name"
					value={self.props.form.emerg2Name}
					reduxAction={reduxAction}
				/>
				<FormInput
					id="emerg2Relation"
					label="Relation"
					value={self.props.form.emerg2Relation}
					reduxAction={reduxAction}
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Primary Phone"
					firstID="emerg2PrimaryPhoneFirst"
					secondID="emerg2PrimaryPhoneSecond"
					thirdID="emerg2PrimaryPhoneThird"
					extID="emerg2PrimaryPhoneExt"
					typeID="emerg2PrimaryPhoneType"
					firstValue={self.props.form.emerg2PrimaryPhoneFirst}
					secondValue={self.props.form.emerg2PrimaryPhoneSecond}
					thirdValue={self.props.form.emerg2PrimaryPhoneThird}
					extValue={self.props.form.emerg2PrimaryPhoneExt}
					typeValue={self.props.form.emerg2PrimaryPhoneType}
					reduxAction={reduxAction}
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Alternate Phone"
					firstID="emerg2AlternatePhoneFirst"
					secondID="emerg2AlternatePhoneSecond"
					thirdID="emerg2AlternatePhoneThird"
					extID="emerg2AlternatePhoneExt"
					typeID="emerg2AlternatePhoneType"
					firstValue={self.props.form.emerg2AlternatePhoneFirst}
					secondValue={self.props.form.emerg2AlternatePhoneSecond}
					thirdValue={self.props.form.emerg2AlternatePhoneThird}
					extValue={self.props.form.emerg2AlternatePhoneExt}
					typeValue={self.props.form.emerg2AlternatePhoneType}
					reduxAction={reduxAction}
				/>

			</tbody></table>
		);

		
		return <JoomlaMainPage>
			<JoomlaNotitleRegion>
				<ProgressThermometer />
			</JoomlaNotitleRegion>
			<JoomlaArticleRegion title="Who should we contact in the event of an emergency?">
				{emergFields}
			</JoomlaArticleRegion>
		</JoomlaMainPage>
	}
}

export default connect<StateProps, DispatchProps, StaticProps, RootState>(
	state => ({
		form: state.emergencyContactForm
	}),
	dispatch => ({
		updateField: (name: keyof Form, value: string) => {
			console.log("updating field!")
			dispatchFormUpdate(dispatch, FORM_NAME)(name, value)
		}
	})
)(EmergencyContact)