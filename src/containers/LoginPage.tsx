import * as React from "react";
import { connect } from "react-redux";
import { Link } from 'redux-little-router';

import JoomlaTwoColumns from "../theme/joomla/JoomlaTwoColumns";
import PlaceholderLink from "../components/PlaceholderLink"
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import Currency from "../util/Currency"
import FormWrappedTextInput from "../components/FormWrappedTextInput";
import Button from "../components/Button";
import { RootState } from '../reducer/rootReducer'
import { loginAction } from '../async/login'
import {formReducer, dispatchFormUpdate} from "../form/form"

// TODO: duplicated in App and here
export const FORM_NAME = "login"

export interface LoginForm {
	username: string,
	password: string
}

export type StateProps = {
	jpPrice: Currency,
	lastSeason: number,
	form: LoginForm
}

interface DispatchProps {
	login: (form: LoginForm) => void,
	updateField: (name: keyof LoginForm, value: string) => void
}

interface StaticProps {
	formName: string
}

type Props = StateProps & DispatchProps & StaticProps

class FormInput extends FormWrappedTextInput<LoginForm> {}

class LoginPage extends React.PureComponent<Props> {	
	render() {
		console.log("login page props: ", this.props)
		const self = this;
		const loginFunction = () => self.props.login(self.props.form);
		
		// left column 

		const welcomeRegion = (
			<JoomlaArticleRegion title={<span>Welcome to CBI Online!<br />-  Junior Program  -</span>}>
				<div>
					If you are new to Community Boating and would like to purchase a Junior Program membership for your child,
					<b>{" click on the first option "}</b>
					{"to the right.  Once your child's registration is complete you can return here to sign him/her up "}
					for classes and view his/her progression throughout the summer.
					<br />
					<br />
					If you were looking for <b>{"Adult Program"}</b> registration, please <PlaceholderLink text={"click here!"} />
				</div>
			</JoomlaArticleRegion>
		);

		const scholarshipRegion = (
			<JoomlaArticleRegion title="Scholarships are available to provide sailing for all.">
				{`
					The price of a Junior Program membership is ${self.props.jpPrice.format(true)}.
					Community Boating Inc. provides scholarships for families in need
					so that every child has an opportunity to enroll in the Junior Program.
					To find out if you qualify for a scholarship,
					please create an account and fill out the scholarship form.
				`}
			</JoomlaArticleRegion>
		);


		// right columns 

		const newAcctRegion = (
			<JoomlaArticleRegion title="My child and I are new to Community Boating.">
				<div>
					<ul style={{ fontSize: "0.92em", marginLeft: "20px" }}>
						<li><Link href="/precreate">
							Click here to create a parent account.
						</Link></li>
					</ul>
					<br />
					{`If your child was a member in ${self.props.lastSeason}, please use your email and password from last season, ` + 
					`rather than creating a new account.`}
				</div>
			</JoomlaArticleRegion>
		);

		const loginRegion = (
			<JoomlaArticleRegion title="I already have an account.">
				<div>
					Enter your email address and password to continue.
					<br />
					<table><tbody>
						<FormInput
							id="username"
							label="Email"
							isPassword={false}
							value={self.props.form.username}
							onChange={(ev: React.ChangeEvent<HTMLInputElement>) => self.props.updateField("username", ev.target.value)}
						/>
						<FormInput
							id="password"
							label="Password"
							isPassword={true}
							extraCells={ <Button text="LOGIN" onClick={loginFunction} /> }
							value={self.props.form.password}
							onChange={(ev: React.ChangeEvent<HTMLInputElement>) => self.props.updateField("password", ev.target.value)} onEnter={loginFunction}
						/>
						<tr><td></td><td><span>
							<PlaceholderLink text="I forgot my password!" />
						</span></td></tr>
					</tbody></table>
				</div>
			</JoomlaArticleRegion>
		);

		const inPersonRegion = (
			<JoomlaArticleRegion title="I purchased a membership in person.">
				<div>
					{`If you have already purchased a membership for this year in person,
					you should have received an email with a link to set a password for your account.
					If you did not receive the email, click \"I Forgot My Password\" to the right
					and we will send you another `}
					<b>(IMPORTANT: Be sure to use the same email address used for initial registration)</b>
					{`. If you still have difficulty accessing your account, please call the boathouse at 617-523-1038.`}
				</div>
			</JoomlaArticleRegion>
		)

		const leftColumn = <div>
			{welcomeRegion}
			{scholarshipRegion}
		</div>

		const rightColumn = <div>
			{newAcctRegion}
			{loginRegion}
			{inPersonRegion}
		</div>
		return <JoomlaTwoColumns left={leftColumn} right={rightColumn}></JoomlaTwoColumns>
	}
}

const standardFormReducer = formReducer<LoginForm>(FORM_NAME);

export const loginFormReducer = (state: any = {}, action: any) => {
	const modifiedState = 
		action.type == "LOGIN_FAILURE"
		? {...state, password: ""}
		: state;
	return standardFormReducer(modifiedState, action);
}

export default connect<StateProps, DispatchProps, StaticProps, RootState>(
	rootState => ({
		jpPrice: Currency.cents(32500),
		lastSeason: 2018,
		form: {
			username: rootState.loginForm.username,
			password: rootState.loginForm.password
		}
	}),
	dispatch => ({
		login: (form: LoginForm) => {
			loginAction(dispatch, form.username, form.password)
		},
		updateField: (name: keyof LoginForm, value: string) => dispatchFormUpdate(dispatch, FORM_NAME)(name, value)
	})
)(LoginPage)
