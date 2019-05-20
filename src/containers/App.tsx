import { ConnectedRouter } from 'connected-react-router';
import * as React from 'react';
import { connect } from "react-redux";
import { Route, Switch } from 'react-router';
import Gatekeeper from "../containers/create-acct/Gatekeeper";
import { LoginState } from "../core/reducer/loginStateReducer";
import { RootState } from '../rootReducer';
import JoomlaBase from '../theme/joomla/JoomlaBase';
import CreateAccount from './create-acct/CreateAccount';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RatingsPage, { path as ratingsPagePath } from './RatingsPage';
import RegistrationWizard, {path as registrationWizardPath} from './registration/RegistrationWizard';
import { Dispatch } from 'redux';

const mapStateToProps = (state: RootState) => ({
	state,
	router: state.router,
	isServer: state.staticState.isServer,
	login: state.login
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
	dispatch
})

interface SelfProps {
	history: any
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & SelfProps

class App extends React.Component<Props> {
	registrationWizard: React.ComponentType
	constructor(props: Props) {
		super(props)
		console.log("in app constructor")
		console.log(props.router.location)
		this.registrationWizard = RegistrationWizard(this.props.state)
	}
	shouldComponentUpdate(nextProps: Props) {
		console.log("in SCU")
		if (this.props.router.location !== nextProps.router.location) {
			console.log("location changed!")
			console.log(nextProps.router.location)
			this.registrationWizard = RegistrationWizard(nextProps.state)
		}
		return true
	}
	render() {
		console.log("in app render")
		console.log(this.props.state.router.location)
		const self = this;
		const devTools = (!this.props.isServer) ? (function(){
			const DevTools = require('../core/DevTools').default;	// TODO: should be import?
			return <DevTools />;
		}()) : undefined;
		console.log(this.props)
		//const path = this.props.router.pathname

		const mustNotBeLoggedIn = [
			<Route key="/precreate" path="/precreate" component={Gatekeeper} />,
			<Route key="/create-acct" path="/create-acct" component={CreateAccount} />,
			<Route key="default" component={LoginPage} />
		]

		const mustBeLoggedIn = [
			<Route key={ratingsPagePath} exact path={ratingsPagePath} component={RatingsPage} />,
			<Route key="reg" exact path={registrationWizardPath} component={this.registrationWizard} />,
			// <Route key={requiredInfoPath} exact path={requiredInfoPath} component={RequiredInfo} />,
			// <Route key={emergencyContactPath} exact path={emergencyContactPath} component={EmergencyContact} />,
			// <Route key={swimProofPath} exact path={swimProofPath} component={SwimProof} />,
			// <Route key={surveyPath} exact path={surveyPath} component={SurveyInfo} />,
			<Route key="default" component={HomePage} />
		]

		const isLoggedIn = self.props.login && self.props.login.authenticatedUserName;
		
		const authedDependedRoutes = isLoggedIn ? mustBeLoggedIn : mustNotBeLoggedIn

		console.log("about to evaluate route: ", this.props.history)
		console.log("router.location", this.props.router.location)

		return (
			<div>
				<JoomlaBase>
					<ConnectedRouter history={this.props.history}>
						<Switch>
							{...authedDependedRoutes}
						</Switch>
					</ConnectedRouter>
					{devTools}
				</JoomlaBase>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
