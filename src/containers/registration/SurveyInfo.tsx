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
import { RadioGroup, CheckboxGroup } from "../../components/RadioGroup";

export const FORM_NAME = "registrationRequiredInfo"

export interface Form {
    genderID: string
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


class FormRadio extends RadioGroup<Form> {}
class FormCheckbox extends CheckboxGroup<Form>{}
interface StateProps {
	form: Form
}

interface DispatchProps {
	updateField: (name: keyof Form, value: string) => void
}

interface StaticProps { }

type Props = StateProps & DispatchProps & StaticProps;

class SurveyInfo extends React.PureComponent<Props> {
	render() {
		const self = this;
		const reduxAction = self.props.updateField;


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
                        value={self.props.form.genderID}
                    />
					<FormCheckbox
                        id="genderID"
                        label="Gender"
                        columns={3}
                        values={genders}
                        reduxAction={reduxAction}
                        value={self.props.form.genderID}
                    />
                </tbody></table>
            </JoomlaArticleRegion>
		</JoomlaMainPage>
	}
}

export default connect<StateProps, DispatchProps, StaticProps, RootState>(
	state => ({
        form: {
            genderID: null
        }
	}),
	dispatch => ({
		updateField: (name: keyof Form, value: string) => {
			console.log("updating field!")
			dispatchFormUpdate(dispatch, FORM_NAME)(name, value)
		}
	})
)(SurveyInfo)