import { push } from 'connected-react-router';
import * as t from 'io-ts'
import {Option, some, none} from 'fp-ts/lib/Option'
import * as moment from "moment";
import * as React from "react";
import {Dispatch} from "redux";
import { connect } from "react-redux";
import { matchPath } from 'react-router-dom';
import DateTriPicker, { DateTriPickerProps, componentsToDate, dateStringToComponents } from "../../components/DateTriPicker";
import PhoneTriBox, { PhoneTriBoxProps, splitPhone, combinePhone } from "../../components/PhoneTriBox";
import ProgressThermometer from "../../components/ProgressThermometer";
import { Select } from "../../components/Select";
import TextArea from "../../components/TextArea";
import TextInput from "../../components/TextInput";
import { countries, states } from "../../lov";
import { RootState } from '../../reducer/rootReducer';
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaNotitleRegion from "../../theme/joomla/JoomlaNotitleRegion";
import range from "../../util/range";
import {getReduxState} from "../../reducer/store"
import {FormState, get, dispatchFormUpdate, post} from "../../form/form"
import Button from "../../components/Button";
import {getWrapper, postWrapper, validator} from "../../async/endpoints/junior/required"

export const FORM_NAME = "registrationRequiredInfo"

export const path = '/required/:personId'

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
		dispatchFormUpdate(dispatch, FORM_NAME)(name, value)
	},
	goHome: () => dispatch(push('/'))
})

class FormInput extends TextInput<Form> {}
class FormSelect extends Select<Form> {}
class FormTextArea extends TextArea<Form> {}

interface StaticProps { }

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & StaticProps;

class RequiredInfo extends React.PureComponent<Props> {
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
		
		get(FORM_NAME, getWrapper(this.personId), apiToForm)
	}
	render() {
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
					value={self.props.form.data.firstName}
					reduxAction={reduxAction}
					blurBox={self.props.form.apiState=="WAITING"}
				/>
				<FormInput
					id="middleInitial"
					label="Middle Initial"
					value={self.props.form.data.middleInitial}
					reduxAction={reduxAction}
					blurBox={self.props.form.apiState=="WAITING"}
				/>
				<FormInput
					id="lastName"
					label="Last Initial"
					isRequired={true}
					value={self.props.form.data.lastName}
					reduxAction={reduxAction}
					blurBox={self.props.form.apiState=="WAITING"}
				/>
				<DateTriPicker<Form, DateTriPickerProps<Form>>
					years={years}
					monthID="dobMonth"
					dayID="dobDate"
					yearID="dobYear"
					isRequired={true}
					monthValue={self.props.form.data.dobMonth}
					dayValue={self.props.form.data.dobDate}
					yearValue={self.props.form.data.dobYear}
					reduxAction={reduxAction}
					blurBox={self.props.form.apiState=="WAITING"}
				/>
				<FormInput
					id="childEmail"
					label="Child Email"
					value={self.props.form.data.childEmail}
					reduxAction={reduxAction}
					blurBox={self.props.form.apiState=="WAITING"}
				/>
				{(self.props.form.apiState=="WAITING") ? (
					// TODO: fake input for blurbox, replace with static blurbox
					<FormInput
						id="childEmail"
						label=""
						value={self.props.form.data.childEmail}
						reduxAction={reduxAction}
						blurBox={true}
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
					value={self.props.form.data.addr1}
					reduxAction={reduxAction}
					blurBox={self.props.form.apiState=="WAITING"}
				/>
				<FormInput
					id="addr2"
					label="Address 2"
					value={self.props.form.data.addr2}
					reduxAction={reduxAction}
					blurBox={self.props.form.apiState=="WAITING"}
				/>
				<FormInput
					id="addr3"
					label="Address 3"
					value={self.props.form.data.addr3}
					reduxAction={reduxAction}
					blurBox={self.props.form.apiState=="WAITING"}
				/>
				<FormInput
					id="city"
					label="City"
					isRequired={true}
					value={self.props.form.data.city}
					reduxAction={reduxAction}
					blurBox={self.props.form.apiState=="WAITING"}
				/>
				<FormSelect
					id="state"
					label="State"
					isRequired={true}
					value={self.props.form.data.state}
					reduxAction={reduxAction}
					options={states}
					nullDisplay="- Select -"
					blurBox={self.props.form.apiState=="WAITING"}
				/>
				<FormInput
					id="zip"
					label="Zip"
					isRequired={true}
					value={self.props.form.data.zip}
					reduxAction={reduxAction}
					blurBox={self.props.form.apiState=="WAITING"}
				/>
				<FormSelect		// TODO: default to US
					id="country"
					label="Country"
					isRequired={true}
					value={self.props.form.data.country}
					reduxAction={reduxAction}
					options={countries}
					nullDisplay="- Select -"
					blurBox={self.props.form.apiState=="WAITING"}
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Parent Primary Phone"
					firstID="primaryPhoneFirst"
					secondID="primaryPhoneSecond"
					thirdID="primaryPhoneThird"
					extID="primaryPhoneExt"
					typeID="primaryPhoneType"
					firstValue={self.props.form.data.primaryPhoneFirst}
					secondValue={self.props.form.data.primaryPhoneSecond}
					thirdValue={self.props.form.data.primaryPhoneThird}
					extValue={self.props.form.data.primaryPhoneExt}
					typeValue={self.props.form.data.primaryPhoneType}
					reduxAction={reduxAction}
					blurBox={self.props.form.apiState=="WAITING"}
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Parent Alternate Phone"
					firstID="alternatePhoneFirst"
					secondID="alternatePhoneSecond"
					thirdID="alternatePhoneThird"
					extID="alternatePhoneExt"
					typeID="alternatePhoneType"
					firstValue={self.props.form.data.alternatePhoneFirst}
					secondValue={self.props.form.data.alternatePhoneSecond}
					thirdValue={self.props.form.data.alternatePhoneThird}
					extValue={self.props.form.data.alternatePhoneExt}
					typeValue={self.props.form.data.alternatePhoneType}
					reduxAction={reduxAction}
					blurBox={self.props.form.apiState=="WAITING"}
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
					value={self.props.form.data.allergies}
					reduxAction={reduxAction}
					placeholder="Please leave blank if none"
					blurBox={self.props.form.apiState=="WAITING"}
				/>
				<FormTextArea
					id="medications"
					label="Medications"
					rows={4}
					cols={60}
					value={self.props.form.data.medications}
					reduxAction={reduxAction}
					placeholder="Please leave blank if none"
					blurBox={self.props.form.apiState=="WAITING"}
				/>
				<FormTextArea
					id="specialNeeds"
					label="Special Needs"
					rows={4}
					cols={60}
					value={self.props.form.data.specialNeeds}
					reduxAction={reduxAction}
					placeholder="Please leave blank if none"
					blurBox={self.props.form.apiState=="WAITING"}
				/>
			</tbody></table>
		);
		return <JoomlaMainPage>
			<JoomlaNotitleRegion>
				<ProgressThermometer />
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
			<Button text="Next" onClick={() => {
				post(FORM_NAME, postWrapper(this.personId))(formToAPI(this.props.form.data)).then(this.props.goHome)
			}}/>
		</JoomlaMainPage>
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RequiredInfo)