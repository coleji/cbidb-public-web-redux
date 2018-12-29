import * as React from 'react'
import { connect } from "react-redux";

import JoomlaBase from '../theme/joomla/JoomlaBase'
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import {RootState} from '../reducer/rootReducer'
import {LoginState} from "../reducer/loginStateReducer"
import Gatekeeper from "../containers/create-acct/Gatekeeper";
import CreateAccount from './create-acct/CreateAccount';

interface StateProps {
	router: Location,
	isServer: boolean,
	login: LoginState
}

interface DispatchProps {

}

interface SelfProps {

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
		
		const toRender = (function() {
			switch (path) {
				case "/precreate":
					//TODO: dont allow this path etc if authenticated
					return <Gatekeeper />
				case "/create-acct":
					return <CreateAccount formName="create-acct"/>
				default:
					if (self.props.login && self.props.login.authenticatedUserName) {
						return <HomePage />
					} else {
						return <LoginPage formName="login"/>
					}
			}
		}())
		return (
			<div>
				<JoomlaBase>
						{toRender}
						{devTools}
				</JoomlaBase>
			</div>
		)
	}
}

export default connect<StateProps, DispatchProps, SelfProps, RootState>(
	state => ({
		router: state.router,
		isServer: state.isServer,
		login: state.login
	}),
	dispatch => ({})
)(App)