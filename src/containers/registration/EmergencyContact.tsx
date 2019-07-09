import * as React from "react";
import * as t from 'io-ts'
import { connect } from "react-redux";
import PhoneTriBox, { PhoneTriBoxProps, splitPhone, combinePhone } from "../../components/PhoneTriBox";
import ProgressThermometer from "../../components/ProgressThermometer";
import TextInput from "../../components/TextInput";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaNotitleRegion from "../../theme/joomla/JoomlaNotitleRegion";
import { Option } from "fp-ts/lib/Option";
import {Dispatch} from "redux";
import { push } from 'connected-react-router';
import Button from "../../components/Button";
import {getWrapper, postWrapper, validator} from "../../async/junior/emerg-contact"
import getPersonIdFromPath from "../../util/getPersonIdFromPath";
import Breadcrumb from "../../core/Breadcrumb";
import { History } from "history";
import formUpdateState from '../../util/form-update-state'
import { PostJSON } from "../../core/APIWrapper";
import asc from "../../app/AppStateContainer";

export const formName = "emergencyContact"

type ApiType = t.TypeOf<typeof validator>

export type Form = ApiType & {
	emerg1PhonePrimaryFirst: Option<string>,
	emerg1PhonePrimarySecond: Option<string>,
	emerg1PhonePrimaryThird: Option<string>,
	emerg1PhonePrimaryExt: Option<string>,

	emerg1PhoneAlternateFirst: Option<string>,
	emerg1PhoneAlternateSecond: Option<string>,
	emerg1PhoneAlternateThird: Option<string>,
	emerg1PhoneAlternateExt: Option<string>,

	emerg2PhonePrimaryFirst: Option<string>,
	emerg2PhonePrimarySecond: Option<string>,
	emerg2PhonePrimaryThird: Option<string>,
	emerg2PhonePrimaryExt: Option<string>,

	emerg2PhoneAlternateFirst: Option<string>,
	emerg2PhoneAlternateSecond: Option<string>,
	emerg2PhoneAlternateThird: Option<string>,
	emerg2PhoneAlternateExt: Option<string>,
}

const apiToForm: (api: ApiType) => Form = api => {
	const {first: emerg1PhonePrimaryFirst, second: emerg1PhonePrimarySecond, third: emerg1PhonePrimaryThird, ext: emerg1PhonePrimaryExt} = splitPhone(api.emerg1PhonePrimary)
	const {first: emerg1PhoneAlternateFirst, second: emerg1PhoneAlternateSecond, third: emerg1PhoneAlternateThird, ext: emerg1PhoneAlternateExt} = splitPhone(api.emerg1PhoneAlternate)
	const {first: emerg2PhonePrimaryFirst, second: emerg2PhonePrimarySecond, third: emerg2PhonePrimaryThird, ext: emerg2PhonePrimaryExt} = splitPhone(api.emerg2PhonePrimary)
	const {first: emerg2PhoneAlternateFirst, second: emerg2PhoneAlternateSecond, third: emerg2PhoneAlternateThird, ext: emerg2PhoneAlternateExt} = splitPhone(api.emerg2PhoneAlternate)
	return {
		...api,
		emerg1PhonePrimaryFirst,
		emerg1PhonePrimarySecond,
		emerg1PhonePrimaryThird,
		emerg1PhonePrimaryExt,
		emerg1PhoneAlternateFirst,
		emerg1PhoneAlternateSecond,
		emerg1PhoneAlternateThird,
		emerg1PhoneAlternateExt,
		emerg2PhonePrimaryFirst,
		emerg2PhonePrimarySecond,
		emerg2PhonePrimaryThird,
		emerg2PhonePrimaryExt,
		emerg2PhoneAlternateFirst,
		emerg2PhoneAlternateSecond,
		emerg2PhoneAlternateThird,
		emerg2PhoneAlternateExt,
	}
}

const formToAPI: (form: Form) => ApiType = form => ({
	...form,
	emerg1PhonePrimary: combinePhone(form.emerg1PhonePrimaryFirst, form.emerg1PhonePrimarySecond, form.emerg1PhonePrimaryThird, form.emerg1PhonePrimaryExt),
	emerg1PhoneAlternate: combinePhone(form.emerg1PhoneAlternateFirst, form.emerg1PhoneAlternateSecond, form.emerg1PhoneAlternateThird, form.emerg1PhoneAlternateExt),
	emerg2PhonePrimary: combinePhone(form.emerg2PhonePrimaryFirst, form.emerg2PhonePrimarySecond, form.emerg2PhonePrimaryThird, form.emerg2PhonePrimaryExt),
	emerg2PhoneAlternate: combinePhone(form.emerg2PhoneAlternateFirst, form.emerg2PhoneAlternateSecond, form.emerg2PhoneAlternateThird, form.emerg2PhoneAlternateExt),
})

class FormInput extends TextInput<Form> {}

interface Props {
	personId: number,
	initialFormData: ApiType,
	goNext: () => void,
	goPrev: () => void,
	breadcrumb: JSX.Element,
	history: History<any>
}

interface State {
	formData: Form
}

export default class EmergencyContact extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: apiToForm(this.props.initialFormData)
		};
	}
	render() {
		const self = this;
		const data = this.state.formData;
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		const emergFields = (
			<table><tbody>
				<FormInput
					id="emerg1Name"
					label="Emergency Contact #1 Name"
					isRequired={true}
					value={data.emerg1Name}
					updateAction={updateState}
				/>
				<FormInput
					id="emerg1Relation"
					label="Relation"
					isRequired={true}
					value={data.emerg1Relation}
					updateAction={updateState}
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Primary Phone"
					isRequired={true}
					firstID="emerg1PhonePrimaryFirst"
					secondID="emerg1PhonePrimarySecond"
					thirdID="emerg1PhonePrimaryThird"
					extID="emerg1PhonePrimaryExt"
					typeID="emerg1PhonePrimaryType"
					firstValue={data.emerg1PhonePrimaryFirst}
					secondValue={data.emerg1PhonePrimarySecond}
					thirdValue={data.emerg1PhonePrimaryThird}
					extValue={data.emerg1PhonePrimaryExt}
					typeValue={data.emerg1PhonePrimaryType}
					updateAction={updateState}
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Alternate Phone"
					firstID="emerg1PhoneAlternateFirst"
					secondID="emerg1PhoneAlternateSecond"
					thirdID="emerg1PhoneAlternateThird"
					extID="emerg1PhoneAlternateExt"
					typeID="emerg1PhoneAlternateType"
					firstValue={data.emerg1PhoneAlternateFirst}
					secondValue={data.emerg1PhoneAlternateSecond}
					thirdValue={data.emerg1PhoneAlternateThird}
					extValue={data.emerg1PhoneAlternateExt}
					typeValue={data.emerg1PhoneAlternateType}
					updateAction={updateState}
				/>
				<FormInput
					id="emerg2Name"
					label="Emergency Contact #2 Name"
					value={data.emerg2Name}
					updateAction={updateState}
				/>
				<FormInput
					id="emerg2Relation"
					label="Relation"
					value={data.emerg2Relation}
					updateAction={updateState}
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Primary Phone"
					firstID="emerg2PhonePrimaryFirst"
					secondID="emerg2PhonePrimarySecond"
					thirdID="emerg2PhonePrimaryThird"
					extID="emerg2PhonePrimaryExt"
					typeID="emerg2PhonePrimaryType"
					firstValue={data.emerg2PhonePrimaryFirst}
					secondValue={data.emerg2PhonePrimarySecond}
					thirdValue={data.emerg2PhonePrimaryThird}
					extValue={data.emerg2PhonePrimaryExt}
					typeValue={data.emerg2PhonePrimaryType}
					updateAction={updateState}
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Alternate Phone"
					firstID="emerg2PhoneAlternateFirst"
					secondID="emerg2PhoneAlternateSecond"
					thirdID="emerg2PhoneAlternateThird"
					extID="emerg2PhoneAlternateExt"
					typeID="emerg2PhoneAlternateType"
					firstValue={data.emerg2PhoneAlternateFirst}
					secondValue={data.emerg2PhoneAlternateSecond}
					thirdValue={data.emerg2PhoneAlternateThird}
					extValue={data.emerg2PhoneAlternateExt}
					typeValue={data.emerg2PhoneAlternateType}
					updateAction={updateState}
				/>

			</tbody></table>
		);

		
		return <JoomlaMainPage>
			<JoomlaNotitleRegion>
				{this.props.breadcrumb}
			</JoomlaNotitleRegion>
			<JoomlaArticleRegion title="Who should we contact in the event of an emergency?">
				{emergFields}
			</JoomlaArticleRegion>
			<Button text="< Back" onClick={self.props.goPrev}/>
			<Button text="Next >" onClick={() => {
				postWrapper(this.props.personId).send(asc.state.appProps.serverToUseForAPI)(PostJSON(formToAPI(this.state.formData))).then(self.props.goNext)
			}}/>
		</JoomlaMainPage>
	}
}