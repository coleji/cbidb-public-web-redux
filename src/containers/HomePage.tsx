import * as React from "react";
import { connect } from "react-redux";

import JoomlaTwoColumns from "../components/JoomlaTwoColumns";
import Currency from "../util/Currency"
import { RootState } from '../reducer/rootReducer'
import { loginAction } from '../async/login'

interface StateProps {
	jpPrice: Currency,
	lastSeason: number
}

interface DispatchProps {
	login: (userName: string, password: string) => void
}

interface LoginProps { userName: string, password: string }

interface SelfProps { }

type Props = StateProps & DispatchProps & SelfProps

class HomePage extends React.PureComponent<Props> {
	constructor(props: Props) {
		super(props);
	}
	render() {
		console.log("RENDERING HOME PAGE")
		const self = this;

		const leftColumn = <div>
		Hi!
		</div>

		const rightColumn = <div>

		</div>
		return <JoomlaTwoColumns left={leftColumn} right={rightColumn}></JoomlaTwoColumns>
	}
}

export default connect<StateProps, DispatchProps, SelfProps, RootState>(
	state => ({
		jpPrice: Currency.cents(32500),
		lastSeason: 2018
	}),
	dispatch => ({
		login: (userName, password) => {
			console.log("logging in")
			loginAction(dispatch, userName, password)
		}
	})
)(HomePage)