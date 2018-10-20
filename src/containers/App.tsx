import * as React from 'react'
import { Route, Link, Redirect, Switch } from 'react-router-dom'
import Picker from "./Picker"
import Counter from "./Counter"

const devTools = (true) ? (function(){
	const DevTools = require('../DevTools').default;
	return <DevTools />;
}()) : undefined;

const routes = <Switch>
	<Route exact path="/" render={() => <Picker />} />
	<Route path="/counter/:num" render={props => {
		console.log("routing props: ", props)
		return (<Counter blah={props.match.params.num}/>)
	}} />
	<Route render={() => (<div>Miss</div>)} />
</Switch>

class App extends React.Component {
	render() {
		return (
			<div>
				{routes}
				{devTools}
			</div>
		)
	}
}

export default App