import { push } from 'connected-react-router';
import * as t from 'io-ts'
import {Option, some, none} from 'fp-ts/lib/Option'
import * as React from "react";
import {Dispatch} from "redux";
import { connect } from "react-redux";
import DateTriPicker, { DateTriPickerProps, componentsToDate, dateStringToComponents } from "../../components/DateTriPicker";
import PhoneTriBox, { PhoneTriBoxProps, splitPhone, combinePhone } from "../../components/PhoneTriBox";
import ProgressThermometer from "../../components/ProgressThermometer";
import { Select } from "../../components/Select";
import TextArea from "../../components/TextArea";
import TextInput from "../../components/TextInput";
import states from "../../lov/states"
import countries from "../../lov/countries"
import { RootState } from '../../rootReducer';
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaNotitleRegion from "../../theme/joomla/JoomlaNotitleRegion";
import range from "../../util/range";
import {getReduxState} from "../../core/reducer/store"
import {dispatchFormUpdate, post} from "../../core/form/form"
import Button from "../../components/Button";
import {getWrapper, postWrapper, validator} from "../../async/junior/required"
import APIBlockedComponent from '../../core/form/APIBlockedComponent';
import getPersonIdFromPath from '../../util/getPersonIdFromPath';
import Breadcrumb from '../../core/Breadcrumb';

export const formName = "registrationRequiredInfo"

type ApiType = t.TypeOf<typeof validator>

export type Form = ApiType & {
	dobMonth: Option<string>,
	dobDate: Option<string>,
	dobYear: Option<string>,
	primaryPhoneFirst: Option<string>,
	primaryPhoneSecond: Option<string>,
	primaryPhoneThird: Option<string>,
	primaryPhoneExt: Option<string>
	alternatePhoneFirst: Option<string>,
	alternatePhoneSecond: Option<string>,
	alternatePhoneThird: Option<string>,
	alternatePhoneExt: Option<string>
}

const apiToForm: (api: ApiType) => Form = api => {
	const {first: primaryPhoneFirst, second: primaryPhoneSecond, third: primaryPhoneThird, ext: primaryPhoneExt} = splitPhone(api.primaryPhone)
	const {first: alternatePhoneFirst, second: alternatePhoneSecond, third: alternatePhoneThird, ext: alternatePhoneExt} = splitPhone(api.alternatePhone)
	const [dobMonth, dobDate, dobYear] = dateStringToComponents(api.dob).fold(
		[none, none, none],
		a => [some(a.month), some(a.date), some(a.year)]
	)
	return {
		...api,
		dobDate,
		dobMonth,
		dobYear,
		primaryPhoneFirst,
		primaryPhoneSecond,
		primaryPhoneThird,
		primaryPhoneExt,
		alternatePhoneFirst,
		alternatePhoneSecond,
		alternatePhoneThird,
		alternatePhoneExt
	}
}

const formToAPI: (form: Form) => ApiType = form => {
	console.log("inside formToAPI")
	return {
		...form,
		dob: componentsToDate(form.dobMonth, form.dobDate, form.dobYear),
		primaryPhone: combinePhone(form.primaryPhoneFirst, form.primaryPhoneSecond, form.primaryPhoneThird, form.primaryPhoneExt),
		alternatePhone: combinePhone(form.alternatePhoneFirst, form.alternatePhoneSecond, form.alternatePhoneThird, form.alternatePhoneExt)
	}
}

const mapStateToProps = (state: RootState) => ({
	getMoment: state.staticState.getMoment,
	form: state.registrationRequiredInfoForm,
	router: state.router
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
	updateField: (name: keyof Form, value: string) => {
		console.log("updating field!")
		dispatchFormUpdate(dispatch, formName)(name, value)
	},
//	goBack: () => dispatch(push('/')),	// TODO
	//goNext: (personId: number) => dispatch(push(emergContactPath.replace(":personId", personId.toString())))	// TODO
})

class FormInput extends TextInput<Form> {}
class FormSelect extends Select<Form> {}
class FormTextArea extends TextArea<Form> {}

type StaticProps = {
	personId: number,
	goNext: () => void,
	goPrev: () => void,
	breadcrumb: Breadcrumb
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & StaticProps

class RequiredInfo extends APIBlockedComponent<Props, Form, typeof validator> {
	formName = formName
	getApiWrapper = () => getWrapper(this.props.personId)
	apiToForm = apiToForm
	formToAPI = formToAPI
	getData = () => this.props.form.data
	constructor(props: Props) {
		super(props)
		console.log("RequiredInfo constructor: personId is ", this.props.personId)
	}
	renderPlaceholder() {
		return <span>whatever</span>
	}
	renderComponent(data: Form) {
		console.log("store", getReduxState())
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
					value={data.firstName}
					reduxAction={reduxAction}
				/>
				<FormInput
					id="middleInitial"
					label="Middle Initial"
					value={data.middleInitial}
					reduxAction={reduxAction}
				/>
				<FormInput
					id="lastName"
					label="Last Initial"
					isRequired={true}
					value={data.lastName}
					reduxAction={reduxAction}
				/>
				<DateTriPicker<Form, DateTriPickerProps<Form>>
					years={years}
					monthID="dobMonth"
					dayID="dobDate"
					yearID="dobYear"
					isRequired={true}
					monthValue={data.dobMonth}
					dayValue={data.dobDate}
					yearValue={data.dobYear}
					reduxAction={reduxAction}
				/>
				<FormInput
					id="childEmail"
					label="Child Email"
					value={data.childEmail}
					reduxAction={reduxAction}
				/>
				{(self.props.form.apiState=="WAITING") ? (
					// TODO: fake input for blurbox, replace with static blurbox
					<FormInput
						id="childEmail"
						label=""
						value={data.childEmail}
						reduxAction={reduxAction}
					/>
				) : (
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
				)}
				
				<FormInput
					id="addr1"
					label="Address 1"
					isRequired={true}
					value={data.addr1}
					reduxAction={reduxAction}
				/>
				<FormInput
					id="addr2"
					label="Address 2"
					value={data.addr2}
					reduxAction={reduxAction}
				/>
				<FormInput
					id="addr3"
					label="Address 3"
					value={data.addr3}
					reduxAction={reduxAction}
				/>
				<FormInput
					id="city"
					label="City"
					isRequired={true}
					value={data.city}
					reduxAction={reduxAction}
				/>
				<FormSelect
					id="state"
					label="State"
					isRequired={true}
					value={data.state}
					reduxAction={reduxAction}
					options={states}
					nullDisplay="- Select -"
				/>
				<FormInput
					id="zip"
					label="Zip"
					isRequired={true}
					value={data.zip}
					reduxAction={reduxAction}
				/>
				<FormSelect		// TODO: default to US
					id="country"
					label="Country"
					isRequired={true}
					value={data.country}
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
					firstValue={data.primaryPhoneFirst}
					secondValue={data.primaryPhoneSecond}
					thirdValue={data.primaryPhoneThird}
					extValue={data.primaryPhoneExt}
					typeValue={data.primaryPhoneType}
					reduxAction={reduxAction}
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Parent Alternate Phone"
					firstID="alternatePhoneFirst"
					secondID="alternatePhoneSecond"
					thirdID="alternatePhoneThird"
					extID="alternatePhoneExt"
					typeID="alternatePhoneType"
					firstValue={data.alternatePhoneFirst}
					secondValue={data.alternatePhoneSecond}
					thirdValue={data.alternatePhoneThird}
					extValue={data.alternatePhoneExt}
					typeValue={data.alternatePhoneType}
					reduxAction={reduxAction}
				/>
			</tbody></table>
		);

		const specNeedsFields = (
			<table><tbody>
				<FormTextArea
					id="allergies"
					label="Allergies"
					rows={4}
					cols={60}
					value={data.allergies}
					reduxAction={reduxAction}
					placeholder="Please leave blank if none"
				/>
				<FormTextArea
					id="medications"
					label="Medications"
					rows={4}
					cols={60}
					value={data.medications}
					reduxAction={reduxAction}
					placeholder="Please leave blank if none"
				/>
				<FormTextArea
					id="specialNeeds"
					label="Special Needs"
					rows={4}
					cols={60}
					value={data.specialNeeds}
					reduxAction={reduxAction}
					placeholder="Please leave blank if none"
				/>
			</tbody></table>
		);
		return <JoomlaMainPage>
			<JoomlaNotitleRegion>
				{this.props.breadcrumb}
			</JoomlaNotitleRegion>
			<JoomlaArticleRegion title="All information on this page is required (if applicable).">
				{reqFields}
			</JoomlaArticleRegion>
			<JoomlaArticleRegion title="Does your child have any allergies, medications, or special needs we should be aware of?">
				{"If not, please leave the following fields blank." }
				<br />
				<br />
				{specNeedsFields}
			</JoomlaArticleRegion>
			<Button text="< Back" onClick={this.props.goPrev}/>
			<Button text="Next >" onClick={() => {
				post(formName, postWrapper(this.props.personId))(formToAPI(this.props.form.data.getOrElse({} as any))).then(this.props.goNext)
			}}/>
		</JoomlaMainPage>
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RequiredInfo)