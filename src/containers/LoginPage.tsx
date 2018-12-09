import * as React from "react";
import { connect } from "react-redux";

import JoomlaTwoColumns from "../components/JoomlaTwoColumns";
import PlaceholderLink from "../components/PlaceholderLink"
import JoomlaArticleRegion from "../components/JoomlaArticleRegion";
import Currency from "../util/Currency"
import FormWrappedTextInput from "../components/FormWrappedTextInput";
import Button from "../components/Button";
import { RootState } from '../reducer/rootReducer'
import { loginAction } from '../async/login'
import PureComponentIgnoreForm from "../components/PureComponentIgnoreForm"

const FORM_NAME = "login"

interface FormProps {
	P101_USERNAME: string,
	P101_PASSWORD: string
}

export type StateProps = {
	jpPrice: Currency,
	lastSeason: number,
	form: FormProps
}

export const defaultFormState: FormProps = {
	P101_USERNAME: "",
	P101_PASSWORD: ""
}

interface DispatchProps {
	login: () => void,
	updateField: (name: string, value: string) => void
}

interface StaticProps { }

type Props = StateProps & DispatchProps & StaticProps

class LoginPage extends PureComponentIgnoreForm<Props> {
	private usernameRef = React.createRef<HTMLInputElement>()
	private passwordRef = React.createRef<HTMLInputElement>()
	
	constructor(props: Props) {
		super(props);
	}
	render() {
		console.log("login page props: ", this.props)
		const self = this;

		const login = () => self.props.login();

		class FormInput extends FormWrappedTextInput<FormProps> {}

		// left column 

		const welcomeRegion = (function () {
			const body = <div>
				If you are new to Community Boating and would like to purchase a Junior Program membership for your child,
                <b>{" click on the first option "}</b>
				{"to the right.  Once your child's registration is complete you can return here to sign him/her up "}
				for classes and view his/her progression throughout the summer.
                <br />
				<br />
				If you were looking for <b>{"Adult Program"}</b> registration, please <PlaceholderLink text={"click here!"} />
			</div>
			return <JoomlaArticleRegion title={<span>Welcome to CBI Online!<br />-  Junior Program  -</span>} body={body} />
		}())

		const scholarshipRegion = (function () {
			const body = `
                The price of a Junior Program membership is ${self.props.jpPrice.format(true)}.
                Community Boating Inc. provides scholarships for families in need
                so that every child has an opportunity to enroll in the Junior Program.
                To find out if you qualify for a scholarship,
                please create an account and fill out the scholarship form.
            `
			return <JoomlaArticleRegion title="Scholarships are available to provide sailing for all." body={body} />
		}())


		// right columns 

		const newAcctRegion = (function () {
			const body = <div>
				<ul style={{ fontSize: "0.92em", marginLeft: "20px" }}>
					<li><PlaceholderLink text={"Click here to create a parent account."} /></li>
				</ul>
				<br />
				{`If your child was a member in ${self.props.lastSeason}, please use your email and password from last season, rather than creating a new account.`}
			</div>
			return <JoomlaArticleRegion title="My child and I are new to Community Boating." body={body} />
		}())

		const loginRegion = (function () {
			const button = <Button text="LOGIN" onClick={login} />
			const body = (
				<div>
					Enter your email address and password to continue.
                    <br />
					<table><tbody>
						<FormInput id="P101_USERNAME" label="Email" isPassword={false} onChange={ev => self.props.updateField("P101_USERNAME", ev.target.value)}/>
						<FormInput id="P101_PASSWORD" label="Password" isPassword={true} extraCells={button}  />
						<tr><td></td><td><span><PlaceholderLink text="I forgot my password!" /></span></td></tr>
					</tbody></table>
				</div>
			)
			return <JoomlaArticleRegion title="I already have an account." body={body} />
		}())

		const inPersonRegion = (function () {
			const body = <div>
				{`If you have already purchased a membership for this year in person,
                you should have received an email with a link to set a password for your account.
                If you did not receive the email, click \"I Forgot My Password\" to the right
                and we will send you another `}
				<b>(IMPORTANT: Be sure to use the same email address used for initial registration)</b>
				{`. If you still have difficulty accessing your account, please call the boathouse at 617-523-1038.`}
			</div>
			return <JoomlaArticleRegion title="I purchased a membership in person." body={body} />
		}())

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

export default connect<StateProps, DispatchProps, StaticProps, RootState>(
	rootState => ({
		jpPrice: Currency.cents(32500),
		lastSeason: 2018,
		form: {
			P101_USERNAME: rootState.login.usernameForm,
			P101_PASSWORD: rootState.login.passwordForm
		}
	}),
	dispatch => ({
		login: () => {
			// const formState = rootState.form[FORM_NAME].values as FormProps
			loginAction(dispatch)
		},
		updateField: (name: string, value: string) => dispatch({type: "FIELD", name, value})
	})
)(LoginPage)