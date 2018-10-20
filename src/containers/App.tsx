import * as React from 'react'
import { Route, Link, Redirect, Switch } from 'react-router-dom'
import Picker from "./Picker"
import Counter from "./Counter"

class App extends React.Component {
	render() {
		return (
			<div>
				<Switch>
					<Route exact path="/" render={() => <Picker />} />
					<Route exact path="/counter" render={() => <Counter blah="hi"/>} />
					<Route render={() => (<div>Miss</div>)} />
				</Switch>
			</div>
		)
	}
}

export default App