import * as React from "react";
import { connect } from "react-redux";

import { RootState } from '../../reducer/rootReducer'
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import ProgressThermometer from "../../components/ProgressThermometer";
import TextInput from "../../components/TextInput";
import {formReducer, dispatchFormUpdate} from "../../form/form"
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaNotitleRegion from "../../theme/joomla/JoomlaNotitleRegion";
import {KeyAndDisplay, Select} from "../../components/Select"

export const FORM_NAME = "registrationRequiredInfo"

export interface Form {
	firstName: string
	middleInitial: string
	lastName: string
}


class FormInput extends TextInput<Form> {}

interface StateProps {
	form: Form
}

interface DispatchProps {
	updateField: (name: keyof Form, value: string) => void
}

interface StaticProps { }

type Props = StateProps & DispatchProps & StaticProps

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const leadingZero = (n: number) => n<10 ? String("0" + n) : String(n);

const dobMonthValues: KeyAndDisplay[] = months.map((m, i) => ({key: leadingZero(i), display: m}))

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
				<FormInput
					id="middleInitial"
					label="Middle Initial"
					value={self.props.form.middleInitial}
					reduxAction={self.props.updateField}
				/>
				<FormInput
					id="lastName"
					label="Last Initial"
					value={self.props.form.lastName}
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
			...state.registrationRequiredInfoForm
		}
	}),
	dispatch => ({
		updateField: (name: keyof Form, value: string) => dispatchFormUpdate(dispatch, FORM_NAME)(name, value)
	})
)(RequiredInfo)