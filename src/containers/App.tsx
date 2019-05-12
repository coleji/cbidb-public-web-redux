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
import RequiredInfo, {path as requiredInfoPath} from './registration/RequiredInfo';
import EmergencyContact, {path as emergencyContactPath} from './registration/EmergencyContact';
import SwimProof, {path as swimProofPath} from './registration/SwimProof';
import SurveyInfo, {path as surveyPath} from './registration/SurveyInfo';


interface StateProps {
	router: Location,
	isServer: boolean,
	login: LoginState
}

interface DispatchProps {

}

interface SelfProps {
	history: any
}

type Props = StateProps & DispatchProps & SelfProps

class App extends React.PureComponent<Props> {
	render() {
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
			<Route key={requiredInfoPath} exact path={requiredInfoPath} component={RequiredInfo} />,
			<Route key={emergencyContactPath} exact path={emergencyContactPath} component={EmergencyContact} />,
			<Route key={swimProofPath} exact path={swimProofPath} component={SwimProof} />,
			<Route key={surveyPath} exact path={surveyPath} component={SurveyInfo} />,
			<Route key="default" component={HomePage} />
		]

		const isLoggedIn = self.props.login && self.props.login.authenticatedUserName;
		
		const authedDependedRoutes = isLoggedIn ? mustBeLoggedIn : mustNotBeLoggedIn

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

export default connect<StateProps, DispatchProps, SelfProps, RootState>(
	state => ({
		router: state.router,
		isServer: state.staticState.isServer,
		login: state.login
	}),
	() => ({})
)(App)