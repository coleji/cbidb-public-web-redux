import * as React from "react";
import { connect } from "react-redux";

import { RootState } from '../../reducer/rootReducer'
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import ProgressThermometer from "../../components/ProgressThermometer";
import FormWrappedTextInput from "../../components/FormWrappedTextInput";
import {formReducer, dispatchFormUpdate} from "../../form/form"
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaNotitleRegion from "../../theme/joomla/JoomlaNotitleRegion";

const FORM_NAME = "registrationRequiredInfo"

export interface RegistrationRequiredInfoForm {
	firstName: string
	middleInitial: string
	lastName: string
}

class FormInput extends FormWrappedTextInput<RegistrationRequiredInfoForm> {}

interface StateProps {
	form: RegistrationRequiredInfoForm
}

interface DispatchProps {
	updateField: (name: keyof RegistrationRequiredInfoForm, value: string) => void
}

interface StaticProps { }

type Props = StateProps & DispatchProps & StaticProps

class RequiredInfo extends React.PureComponent<Props> {
	render() {
		const self = this;
		const reqFields = (
			<table><tbody>
				<FormInput
					id="firstName"
					label="First Name"
					value={self.props.form.firstName}
					reduxAction={self.props.updateField}
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
		form: {
			firstName: "",
			middleInitial: "",
			lastName: ""
		}
	}),
	dispatch => ({
		updateField: (name: keyof RegistrationRequiredInfoForm, value: string) => dispatchFormUpdate(dispatch, FORM_NAME)(name, value)
	})
)(RequiredInfo)