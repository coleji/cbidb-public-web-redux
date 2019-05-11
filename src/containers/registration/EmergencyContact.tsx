import * as React from "react";
import * as t from 'io-ts'
import { connect } from "react-redux";
import PhoneTriBox, { PhoneTriBoxProps, splitPhone, combinePhone } from "../../components/PhoneTriBox";
import ProgressThermometer from "../../components/ProgressThermometer";
import TextInput from "../../components/TextInput";
import {FormState, get, dispatchFormUpdate, post} from "../../form/form"
import { RootState } from '../../reducer/rootReducer';
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaNotitleRegion from "../../theme/joomla/JoomlaNotitleRegion";
import { Option, none } from "fp-ts/lib/Option";
import {Dispatch} from "redux";
import { push } from 'connected-react-router';
import Button from "../../components/Button";
import { matchPath } from "react-router";
import {getWrapper, postWrapper, validator} from "../../async/endpoints/junior/emerg-contact"
import {path as swimProofPath} from './SwimProof';
import makeDefault from "../../util/getOptionDefault";

export const FORM_NAME = "emergencyContact"

export const path = '/emerg/:personId'

type ApiType = t.TypeOf<typeof validator>

const foo = makeDefault(validator)

const formDefault = {
	...makeDefault(validator),
	emerg1PhonePrimaryFirst: none as Option<string>,
	emerg1PhonePrimarySecond: none as Option<string>,
	emerg1PhonePrimaryThird: none as Option<string>,
	emerg1PhonePrimaryExt: none as Option<string>,

	emerg1PhoneAlternateFirst: none as Option<string>,
	emerg1PhoneAlternateSecond: none as Option<string>,
	emerg1PhoneAlternateThird: none as Option<string>,
	emerg1PhoneAlternateExt: none as Option<string>,

	emerg2PhonePrimaryFirst: none as Option<string>,
	emerg2PhonePrimarySecond: none as Option<string>,
	emerg2PhonePrimaryThird: none as Option<string>,
	emerg2PhonePrimaryExt: none as Option<string>,

	emerg2PhoneAlternateFirst: none as Option<string>,
	emerg2PhoneAlternateSecond: none as Option<string>,
	emerg2PhoneAlternateThird: none as Option<string>,
	emerg2PhoneAlternateExt: none as Option<string>,
}

export type Form = typeof formDefault

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

const formToAPI: (form: Form) => ApiType = form => {
	console.log("inside formToAPI")
	return {
		...form,
		emerg1PhonePrimary: combinePhone(form.emerg1PhonePrimaryFirst, form.emerg1PhonePrimarySecond, form.emerg1PhonePrimaryThird, form.emerg1PhonePrimaryExt),
		emerg1PhoneAlternate: combinePhone(form.emerg1PhoneAlternateFirst, form.emerg1PhoneAlternateSecond, form.emerg1PhoneAlternateThird, form.emerg1PhoneAlternateExt),
		emerg2PhonePrimary: combinePhone(form.emerg2PhonePrimaryFirst, form.emerg2PhonePrimarySecond, form.emerg2PhonePrimaryThird, form.emerg2PhonePrimaryExt),
		emerg2PhoneAlternate: combinePhone(form.emerg2PhoneAlternateFirst, form.emerg2PhoneAlternateSecond, form.emerg2PhoneAlternateThird, form.emerg2PhoneAlternateExt),
	}
}

const mapStateToProps = (state: RootState) => ({
	form: state.emergencyContactForm,
	router: state.router
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
	updateField: (name: keyof Form, value: string) => {
		console.log("updating field!")
		dispatchFormUpdate(dispatch, FORM_NAME)(name, value)
	},
	goBack: () => dispatch(push('/')),	// TODO
	goNext: (personId: number) => dispatch(push(swimProofPath.replace(":personId", personId.toString())))	// TODO
})

class FormInput extends TextInput<Form> {}
// class FormSelect extends Select<Form> {}

interface StaticProps { }

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & StaticProps;

class EmergencyContact extends React.PureComponent<Props> {
	personId: number
	constructor(props: Props) {
		super(props)
		console.log("constructor!!!")
		// TODO: typesafe? 
		const match = matchPath(
			props.router.location.pathname,
			{ path }
			) || {params: {}};
		this.personId = Number((match.params as any).personId);

		console.log("scraped from the url: " + this.personId)
		
		get(FORM_NAME, formDefault, getWrapper(this.personId), apiToForm)
	}
	render() {
		const self = this;
		const reduxAction = self.props.updateField;

		const emergFields = (
			<table><tbody>
				<FormInput
					id="emerg1Name"
					label="Emergency Contact #1 Name"
					isRequired={true}
					value={self.props.form.data.emerg1Name}
					reduxAction={reduxAction}
				/>
				<FormInput
					id="emerg1Relation"
					label="Relation"
					isRequired={true}
					value={self.props.form.data.emerg1Relation}
					reduxAction={reduxAction}
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Primary Phone"
					isRequired={true}
					firstID="emerg1PhonePrimaryFirst"
					secondID="emerg1PhonePrimarySecond"
					thirdID="emerg1PhonePrimaryThird"
					extID="emerg1PhonePrimaryExt"
					typeID="emerg1PhonePrimaryType"
					firstValue={self.props.form.data.emerg1PhonePrimaryFirst}
					secondValue={self.props.form.data.emerg1PhonePrimarySecond}
					thirdValue={self.props.form.data.emerg1PhonePrimaryThird}
					extValue={self.props.form.data.emerg1PhonePrimaryExt}
					typeValue={self.props.form.data.emerg1PhonePrimaryType}
					reduxAction={reduxAction}
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Alternate Phone"
					firstID="emerg1PhoneAlternateFirst"
					secondID="emerg1PhoneAlternateSecond"
					thirdID="emerg1PhoneAlternateThird"
					extID="emerg1PhoneAlternateExt"
					typeID="emerg1PhoneAlternateType"
					firstValue={self.props.form.data.emerg1PhoneAlternateFirst}
					secondValue={self.props.form.data.emerg1PhoneAlternateSecond}
					thirdValue={self.props.form.data.emerg1PhoneAlternateThird}
					extValue={self.props.form.data.emerg1PhoneAlternateExt}
					typeValue={self.props.form.data.emerg1PhoneAlternateType}
					reduxAction={reduxAction}
				/>
				<FormInput
					id="emerg2Name"
					label="Emergency Contact #2 Name"
					value={self.props.form.data.emerg2Name}
					reduxAction={reduxAction}
				/>
				<FormInput
					id="emerg2Relation"
					label="Relation"
					value={self.props.form.data.emerg2Relation}
					reduxAction={reduxAction}
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Primary Phone"
					firstID="emerg2PhonePrimaryFirst"
					secondID="emerg2PhonePrimarySecond"
					thirdID="emerg2PhonePrimaryThird"
					extID="emerg2PhonePrimaryExt"
					typeID="emerg2PhonePrimaryType"
					firstValue={self.props.form.data.emerg2PhonePrimaryFirst}
					secondValue={self.props.form.data.emerg2PhonePrimarySecond}
					thirdValue={self.props.form.data.emerg2PhonePrimaryThird}
					extValue={self.props.form.data.emerg2PhonePrimaryExt}
					typeValue={self.props.form.data.emerg2PhonePrimaryType}
					reduxAction={reduxAction}
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Alternate Phone"
					firstID="emerg2PhoneAlternateFirst"
					secondID="emerg2PhoneAlternateSecond"
					thirdID="emerg2PhoneAlternateThird"
					extID="emerg2PhoneAlternateExt"
					typeID="emerg2PhoneAlternateType"
					firstValue={self.props.form.data.emerg2PhoneAlternateFirst}
					secondValue={self.props.form.data.emerg2PhoneAlternateSecond}
					thirdValue={self.props.form.data.emerg2PhoneAlternateThird}
					extValue={self.props.form.data.emerg2PhoneAlternateExt}
					typeValue={self.props.form.data.emerg2PhoneAlternateType}
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
			<Button text="< Back" onClick={this.props.goBack}/>
			<Button text="Next >" onClick={() => {
				post(FORM_NAME, postWrapper(this.personId))(formToAPI(this.props.form.data)).then(() => this.props.goNext(this.personId))
			}}/>
		</JoomlaMainPage>
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EmergencyContact)