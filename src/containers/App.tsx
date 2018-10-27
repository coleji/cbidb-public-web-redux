import * as React from 'react'
import Picker from "./Picker"
import Counter from "./Counter"
import { connect } from "react-redux";

import JoomlaBase from '../components/JoomlaBase'
import JoomlaMainPage from '../components/JoomlaMainPage'
import LoginPage from './LoginPage';
import Currency from '../util/Currency'

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
		const toRender = !!result ? <Counter blah={result[1]} /> : <LoginPage jpPrice={Currency.dollars(325)} lastSeason={2018}/>
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

export default connect<AppPropsFromState, AppPropsFromDispatch, AppPropsFromSelf, GlobalState>(
	state => ({
		router: state.router,
		isServer: state.isServer
	}),
	dispatch => ({})
)(App)