import * as React from "react";
import { connect } from "react-redux";
import { CheckboxGroup, RadioGroup, SingleCheckbox } from "../../components/InputGroup";
import ProgressThermometer from "../../components/ProgressThermometer";
import TextInput from "../../components/TextInput";
import { dispatchFormUpdate } from "../../core/form/form";
import { RootState } from '../../rootReducer';
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaNotitleRegion from "../../theme/joomla/JoomlaNotitleRegion";
import { Option, none, some } from "fp-ts/lib/Option";
import { Dispatch } from "redux";
import APIBlockedComponent from "../../core/form/APIBlockedComponent";
import getPersonIdFromPath from "../../util/getPersonIdFromPath";
import ethnicities from "../../lov/ethnicities"
import genders from "../../lov/genders"
import referralSources from "../../lov/referralSources"

export const formName = "surveyInfoForm"
 
export interface Form {
    genderID: Option<string>,
	referral: Option<string[]>,
	referralOther: Option<string>,
	language: Option<string>,
	ethnicity: Option<string[]>,
	ethnicityOther: Option<string>
	school: Option<string>,
	freeLunch: Option<boolean>
}

class FormInput extends TextInput<Form> {}
class FormRadio extends RadioGroup<Form> {}
class FormCheckbox extends CheckboxGroup<Form>{}
class FormBoolean extends SingleCheckbox<Form>{}

const mapStateToProps = (state: RootState) => ({
	form: state.surveyInfoForm,
	router: state.router
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
	updateField: function(name: keyof Form, value: any) {
		console.log("updating field!")
		dispatchFormUpdate(dispatch, formName)(name, value)
	}
})

type StaticProps = {
	personId: number,
	goNext: () => void,
	goPrev: () => void
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & StaticProps

class SurveyInfo extends APIBlockedComponent<Props, Form, any> {
	formName = formName
	getApiWrapper = null as any // () => getWrapper(this.props.personId)
	apiToForm = null as any
	formToAPI = null as any
	getData = () => this.props.form.data
	renderPlaceholder() {
		return <span>whatever</span>
	}
	renderComponent(data: Form) {
		const self = this;
		const reduxAction = self.props.updateField;

		// TODO: blank out the "other" fields in state when the toggling checkbox is unchecked

		return <JoomlaMainPage>
			<JoomlaNotitleRegion>
				<ProgressThermometer />
			</JoomlaNotitleRegion>
            <JoomlaArticleRegion title="This information is helpful but not required.">
                <table><tbody>
                    <FormRadio
                        id="genderID"
                        label="Gender"
                        columns={3}
                        values={genders}
                        reduxAction={reduxAction}
                        value={data.genderID || none}
                    />
					<FormCheckbox
                        id="referral"
                        label={
							<React.Fragment>
							How did you<br />hear about us?
							</React.Fragment>
						}
                        columns={3}
                        values={referralSources}
                        reduxAction={reduxAction}
						value={(data.referral || none)}
                    />
					{
						(data.referral || some([])).getOrElse([]).contains("Other")
						? <FormInput
							id="referralOther"
							label="Other"
							value={data.referralOther || none}
							reduxAction={reduxAction}
						/>
						: null
					}
					<FormInput
						id="language"
						label={
							<React.Fragment>
							Primary language<br />spoken at home
							</React.Fragment>
						}
						value={data.language || none}
						reduxAction={reduxAction}
					/>
					<FormCheckbox
                        id="ethnicity"
                        label="Ethnicity"
                        columns={3}
                        values={ethnicities}
                        reduxAction={reduxAction}
						value={(data.ethnicity || none)}
                    />
					{
						(data.ethnicity || some([])).getOrElse([]).contains("Other")
						? <FormInput
							id="ethnicityOther"
							label="Other"
							value={data.ethnicityOther || none}
							reduxAction={reduxAction}
						/>
						: null
					}
					<FormInput
						id="school"
						label="School"
						value={data.school || none}
						reduxAction={reduxAction}
					/>
					<FormBoolean
						id="freeLunch"
						label={
							<React.Fragment>
							Eligible for Free/<br />Reduced Price Lunch?
							</React.Fragment>
						}
						value={(data.freeLunch || none)}
						reduxAction={reduxAction}
					/>
                </tbody></table>
            </JoomlaArticleRegion>
		</JoomlaMainPage>
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SurveyInfo)