import * as React from 'react'
import { connect } from "react-redux";

import JoomlaBase from '../components/JoomlaBase'
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import {RootState} from '../reducer/rootReducer'
import {LoginState} from "../reducer/loginStateReducer"

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
		const regex = /\/counter\/([0-9])/
		const result = regex.exec(path)
		const toRender = (function() {
			if (self.props.login && self.props.login.authenticatedUserName) {
				return <HomePage />
			} else {
				return <LoginPage formName="login"/>
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