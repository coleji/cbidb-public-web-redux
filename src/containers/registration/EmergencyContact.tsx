import * as React from "react";
import { connect } from "react-redux";
import PhoneTriBox, { PhoneTriBoxProps } from "../../components/PhoneTriBox";
import ProgressThermometer from "../../components/ProgressThermometer";
import TextInput from "../../components/TextInput";
import { dispatchFormUpdate } from "../../form/form";
import { RootState } from '../../reducer/rootReducer';
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaNotitleRegion from "../../theme/joomla/JoomlaNotitleRegion";


export const FORM_NAME = "emergencyContact"

export interface Form {
	emerg1Name: Optional<string>,
	emerg1Relation: Optional<string>,
	emerg1PrimaryPhoneFirst: Optional<string>,
	emerg1PrimaryPhoneSecond: Optional<string>,
	emerg1PrimaryPhoneThird: Optional<string>,
	emerg1PrimaryPhoneExt: Optional<string>,
	emerg1PrimaryPhoneType: Optional<string>,

	emerg1AlternatePhoneFirst: Optional<string>,
	emerg1AlternatePhoneSecond: Optional<string>,
	emerg1AlternatePhoneThird: Optional<string>,
	emerg1AlternatePhoneExt: Optional<string>,
	emerg1AlternatePhoneType: Optional<string>,

	emerg2Name: Optional<string>,
	emerg2Relation: Optional<string>,
	emerg2PrimaryPhoneFirst: Optional<string>,
	emerg2PrimaryPhoneSecond: Optional<string>,
	emerg2PrimaryPhoneThird: Optional<string>,
	emerg2PrimaryPhoneExt: Optional<string>,
	emerg2PrimaryPhoneType: Optional<string>,

	emerg2AlternatePhoneFirst: Optional<string>,
	emerg2AlternatePhoneSecond: Optional<string>,
	emerg2AlternatePhoneThird: Optional<string>,
	emerg2AlternatePhoneExt: Optional<string>,
	emerg2AlternatePhoneType: Optional<string>,
}

class FormInput extends TextInput<Form> {}
// class FormSelect extends Select<Form> {}

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
		form: state.emergencyContactForm.data
	}),
	dispatch => ({
		updateField: (name: keyof Form, value: string) => {
			console.log("updating field!")
			dispatchFormUpdate(dispatch, FORM_NAME)(name, value)
		}
	})
)(EmergencyContact)