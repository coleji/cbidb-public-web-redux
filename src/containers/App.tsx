import * as React from 'react'
import { connect } from "react-redux";
import { Route, Switch } from 'react-router' // react-router v4
import { ConnectedRouter } from 'connected-react-router'

import JoomlaBase from '../theme/joomla/JoomlaBase'
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import RequiredInfo from './registration/RequiredInfo';
import EmergencyContact from './registration/EmergencyContact';
import {RootState} from '../reducer/rootReducer'
import {LoginState} from "../reducer/loginStateReducer"
import Gatekeeper from "../containers/create-acct/Gatekeeper";
import CreateAccount from './create-acct/CreateAccount';
import SwimProof from './registration/SwimProof';
import SurveyInfo from './registration/SurveyInfo';
import RatingsPage, {path as ratingsPagePath} from './RatingsPage';

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
			const DevTools = require('../DevTools').default;
			return <DevTools />;
		}()) : undefined;
		console.log(this.props)
		const path = this.props.router.pathname

		const mustNotBeLoggedIn = [
			<Route path="/precreate" component={Gatekeeper} />,
			<Route path="/create-acct" component={CreateAccount} />,
			<Route component={LoginPage} />
		]

		const mustBeLoggedIn = [
			<Route exact path={ratingsPagePath} component={RatingsPage} />,
			<Route component={HomePage} />
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
	dispatch => ({})
)(App)