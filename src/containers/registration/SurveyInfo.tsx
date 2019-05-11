import * as React from "react";
import { connect } from "react-redux";
import { CheckboxGroup, RadioGroup, SingleCheckbox } from "../../components/InputGroup";
import ProgressThermometer from "../../components/ProgressThermometer";
import TextInput from "../../components/TextInput";
import { dispatchFormUpdate } from "../../form/form";
import { RootState } from '../../reducer/rootReducer';
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaNotitleRegion from "../../theme/joomla/JoomlaNotitleRegion";
import { Option, none, some } from "fp-ts/lib/Option";


export const FORM_NAME = "surveyInfoForm"

export const path = '/survey/:personId'

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

const genders = [{
	key: "M",
	display: "Male"
}, {
	key: "F",
	display: "Female"
}, {
	key: "O",
	display: "Other"
}];

const referralSources = [{
	key: "Friend",
	display: "Friend/Family"
}, {
	key: "Google"
}, {
	key: "Youtube"
}, {
	key: "School"
}, {
	key: "Facebook"
}, {
	key: "Groupon"
}, {
	key: "MBTA"
}, {
	key: "Twitter"
}, {
	key: "Walking By"
}, {
	key: "Other"
}]

const ethnicities = [{
	key: "Asian/Pacific Islander"
}, {
	key: "Caucasian"
}, {
	key: "Native American"
}, {
	key: "African-American"
}, {
	key: "Hispanic"
}, {
	key: "Other"
}]


class FormInput extends TextInput<Form> {}
class FormRadio extends RadioGroup<Form> {}
class FormCheckbox extends CheckboxGroup<Form>{}
class FormBoolean extends SingleCheckbox<Form>{}
interface StateProps {
	form: Option<Form>
}

interface DispatchProps {
	updateField: (name: keyof Form, value: any) => void
}

interface StaticProps { }

type Props = StateProps & DispatchProps & StaticProps;

class SurveyInfo extends React.PureComponent<Props> {
	render() {
		const self = this;
		const reduxAction = self.props.updateField;
		console.log(self.props.form.getOrElse({} as any))

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
                        value={self.props.form.getOrElse({} as any).genderID || none}
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
						value={(self.props.form.getOrElse({} as any).referral || none)}
                    />
					{
						(self.props.form.getOrElse({} as any).referral || some([])).getOrElse([]).contains("Other")
						? <FormInput
							id="referralOther"
							label="Other"
							value={self.props.form.getOrElse({} as any).referralOther || none}
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
						value={self.props.form.getOrElse({} as any).language || none}
						reduxAction={reduxAction}
					/>
					<FormCheckbox
                        id="ethnicity"
                        label="Ethnicity"
                        columns={3}
                        values={ethnicities}
                        reduxAction={reduxAction}
						value={(self.props.form.getOrElse({} as any).ethnicity || none)}
                    />
					{
						(self.props.form.getOrElse({} as any).ethnicity || some([])).getOrElse([]).contains("Other")
						? <FormInput
							id="ethnicityOther"
							label="Other"
							value={self.props.form.getOrElse({} as any).ethnicityOther || none}
							reduxAction={reduxAction}
						/>
						: null
					}
					<FormInput
						id="school"
						label="School"
						value={self.props.form.getOrElse({} as any).school || none}
						reduxAction={reduxAction}
					/>
					<FormBoolean
						id="freeLunch"
						label={
							<React.Fragment>
							Eligible for Free/<br />Reduced Price Lunch?
							</React.Fragment>
						}
						value={(self.props.form.getOrElse({} as any).freeLunch || none)}
						reduxAction={reduxAction}
					/>
                </tbody></table>
            </JoomlaArticleRegion>
		</JoomlaMainPage>
	}
}

export default connect<StateProps, DispatchProps, StaticProps, RootState>(
	state => ({
        form: state.surveyInfoForm.data
	}),
	dispatch => ({
		updateField: function(name: keyof Form, value: any) {
			console.log("updating field!")
			dispatchFormUpdate(dispatch, FORM_NAME)(name, value)
		}
	})
)(SurveyInfo)