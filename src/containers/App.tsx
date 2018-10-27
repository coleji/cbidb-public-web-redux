import * as React from 'react'
import Picker from "./Picker"
import Counter from "./Counter"
import { connect } from "react-redux";

import {JoomlaHelmet, JoomlaBody} from '../components/JoomlaBase'
import JoomlaMainPage from '../components/JoomlaMainPage'

interface AppPropsFromState {
	router: any,
	isServer: boolean
}

interface AppPropsFromDispatch {

}

interface AppPropsFromSelf {

}

type AppProps = AppPropsFromState & AppPropsFromDispatch & AppPropsFromSelf

class App extends React.PureComponent<AppProps> {
	render() {
		const devTools = (!this.props.isServer) ? (function(){
			const DevTools = require('../DevTools').default;
			return <DevTools />;
		}()) : undefined;
		console.log(this.props)
		const path = this.props.router.pathname
		const regex = /\/counter\/([0-9])/
		const result = regex.exec(path)
		const toRender = !!result ? <Counter blah={result[1]} /> : <Picker />
		return (
			<div>
				<JoomlaHelmet>
					<JoomlaBody>
						<JoomlaMainPage>
							{toRender}
							{devTools}
						</JoomlaMainPage>
					</JoomlaBody>
				</JoomlaHelmet>
			</div>
		)
	}
}

export default connect<AppPropsFromState, AppPropsFromDispatch, AppPropsFromSelf, GlobalState>(
	state => ({
		router: state.router,
		isServer: state.isServer
	}),
	dispatch => ({})
)(App)