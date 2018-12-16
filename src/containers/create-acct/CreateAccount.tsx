import * as React from "react";
import { connect } from "react-redux";

import JoomlaMainPage from "../../components/JoomlaMainPage";
import { RootState } from "../../reducer/rootReducer";
import JoomlaArticleRegion from "../../components/JoomlaArticleRegion";
import PlaceholderLink from "../../components/PlaceholderLink";
import Joomla8_4 from "../../components/Joomla8_4";
import JoomlaSidebarRegion from "../../components/JoomlaSidebarRegion";
import FormWrappedTextInput from "../../components/FormWrappedTextInput";
import PureComponentIgnoreForm from "../../components/PureComponentIgnoreForm"

const FORM_NAME = "create-acct"

export class Form {
	firstName: string
	lastName: string
	email: string
	pw1: string
	pw2: string
}

interface StateProps {
	form: Form
}

interface DispatchProps {
	updateField: (name: string, value: string) => void
}

interface StaticProps {
	formName: string
}

type Props = StateProps & DispatchProps & StaticProps


class FormInput extends FormWrappedTextInput<Form> {}

class CreateAccount extends PureComponentIgnoreForm<Props> {
	constructor(props: Props) {
		super(props);
	}
	render() {
		const self= this;
		const main = <JoomlaArticleRegion title="First let's make you a parent account.">
			<table><tbody>
				<FormInput
					id="firstName"
					label="Parent First Name"
					isPassword={false}
					reduxAction={self.props.updateField}
				/>
				<FormInput
					id="lastName"
					label="Parent Last Name"
					isPassword={false}
					reduxAction={self.props.updateField}
				/>
				<FormInput
					id="email"
					label="Parent Email"
					isPassword={false}
					reduxAction={self.props.updateField}
				/>
				<FormInput
					id="pw1"
					label="Create Password"
					isPassword={true}
					reduxAction={self.props.updateField}
				/>
				<FormInput
					id="pw2"
					label="Confirm Password"
					isPassword={false}
					reduxAction={self.props.updateField}
				/>
			</tbody></table>
		</JoomlaArticleRegion>
		const sidebar = <JoomlaSidebarRegion title="INFO">
			<div>
				Please supply an email address and password for your online account. Your account will allow you to register child(ren) for classes, renew their memberships, and sign them up for special Junior Program events.<br />
				<br />
				If you start the registration process and don't complete it, you can use this email/password to continue from where you left off.
			</div>
		</JoomlaSidebarRegion>
		return <Joomla8_4 main={main} right={sidebar} />
	}
}

export default connect<StateProps, DispatchProps, StaticProps, RootState>(
	state => ({
		form: state.createAcctForm
	}),
	dispatch => ({
		updateField: (name: string, value: string) => dispatch({type: "FORM_UPDATE", updatedFormName: FORM_NAME, name, value})
	})
)(CreateAccount)