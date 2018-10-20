import * as React from 'react'
import { Route, Link, Redirect, Switch } from 'react-router-dom'
import Picker from "./Picker"
import Counter from "./Counter"
import { connect } from "react-redux";

const devTools = (true) ? (function(){
	const DevTools = require('../DevTools').default;
	return <DevTools />;
}()) : undefined;
/*
const routes = <Switch>
	<Route exact path="/" render={() => <Picker />} />
	<Route path="/counter/:num" render={props => {
		console.log("routing props: ", props)
		return (<Counter blah={props.match.params.num}/>)
	}} />
	<Route render={() => (<div>Miss</div>)} />
</Switch>*/

interface AppPropsFromState {
	router: any
}

interface AppPropsFromDispatch {

}

interface AppPropsFromSelf {

}

type AppProps = AppPropsFromState & AppPropsFromDispatch & AppPropsFromSelf

class App extends React.PureComponent<AppProps> {
	render() {
		console.log(this.props.router)
		const path = this.props.router.pathname
		const regex = /\/counter\/([0-9])/
		const result = regex.exec(path)
		const toRender = !!result ? <Counter blah={result[1]} /> : <Picker />
		return (
			<div>
				{toRender}
				{devTools}
			</div>
		)
	}
}

export default connect<AppPropsFromState, AppPropsFromDispatch, AppPropsFromSelf, GlobalState>(
	state => ({
		router: state.router
	}),
	dispatch => ({})
)(App)