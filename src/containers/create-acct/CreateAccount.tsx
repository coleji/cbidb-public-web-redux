import { push } from 'connected-react-router';
import * as React from "react";
import { connect } from "react-redux";
import Button from "../../components/Button";
import { placeholderAction } from "../../components/PlaceholderLink";
import TextInput from "../../components/TextInput";
import { dispatchFormUpdate } from "../../form/form";
import { RootState } from "../../reducer/rootReducer";
import Joomla8_4 from "../../theme/joomla/Joomla8_4";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaSidebarRegion from "../../theme/joomla/JoomlaSidebarRegion";


export const FORM_NAME = "create-acct"

export interface Form {
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
	updateField: (name: string, value: string) => void,
	cancel: () => void
}

interface StaticProps {

}

type Props = StateProps & DispatchProps & StaticProps


class FormInput extends TextInput<Form> {}

class CreateAccount extends React.PureComponent<Props> {
	constructor(props: Props) {
		super(props);
	}
	render() {
		const self= this;

		const buttons = <div>
			<Button text="< Cancel" onClick={this.props.cancel}/>
			<Button text="Register" onClick={placeholderAction}/>
		</div>
		const main = <JoomlaArticleRegion title="First let's make you a parent account." buttons={buttons}>
			<table><tbody>
				<FormInput
					id="firstName"
					label="Parent First Name"
					isPassword={false}
					value={self.props.form.firstName}
					reduxAction={self.props.updateField}
				/>
				<FormInput
					id="lastName"
					label="Parent Last Name"
					isPassword={false}
					value={self.props.form.lastName}
					reduxAction={self.props.updateField}
				/>
				<FormInput
					id="email"
					label="Parent Email"
					isPassword={false}
					value={self.props.form.email}
					reduxAction={self.props.updateField}
				/>
				<FormInput
					id="pw1"
					label="Create Password"
					isPassword={true}
					value={self.props.form.pw1}
					reduxAction={self.props.updateField}
				/>
				<FormInput
					id="pw2"
					label="Confirm Password"
					isPassword={true}
					value={self.props.form.pw2}
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
		form: state.createAcctForm.data
	}),
	dispatch => ({
		updateField: (name: keyof Form, value: string) => dispatchFormUpdate(dispatch, FORM_NAME)(name, value),
		cancel: () => dispatch(push('/'))
	})
)(CreateAccount)