import { ConnectedRouter, routerActions } from 'connected-react-router';
import * as React from 'react';
import { connect } from "react-redux";
import { Route, Switch, Redirect } from 'react-router';
import { Dispatch } from 'redux';

import Gatekeeper from "../containers/create-acct/Gatekeeper";
import { LoginState } from "../core/reducer/loginStateReducer";
import { RootState } from '../rootReducer';
import JoomlaBase from '../theme/joomla/JoomlaBase';
import CreateAccount from './create-acct/CreateAccount';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegistrationWizard, {path as registrationWizardPath} from './registration/pageflow/RegistrationWizard';
import SelectClassType, {path as selectClassTypePath} from "./class-signup/SelectClassType"
import SelectClassTime, {path as selectClassTimePath} from "./class-signup/SelectClassTime"
import router from "../routing"
//import RegistrationTransparentFlow from "./registration/pageflow/RegistrationTransparentFlow"

const mapStateToProps = (state: RootState) => ({
	state,
	router: state.router,
	isServer: state.staticState.isServer,
	login: state.login
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
	dispatch
})

interface SelfProps {
	history: any,
	serverSideResolveOnAsyncComplete: (clientSideAsyncResult: any) => {},
	clientSideAsyncResult: any
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & SelfProps

// TODO: make a wizard manager, call its update() in App constructor and SCU,
// wizard routes just call that route in the WM which returns HomePage if that route is not active in the WM
class App extends React.Component<Props> {
	clientSideAsyncResult: any
	registrationWizard: React.ComponentType
	constructor(props: Props) {
		super(props)
		console.log("in app constructor")
		console.log("asyncResult from server: ", this.props.clientSideAsyncResult)
		this.clientSideAsyncResult = this.props.clientSideAsyncResult;
		console.log(props.router.location)
		this.registrationWizard = RegistrationWizard(this.props.state)
	}
	shouldComponentUpdate(nextProps: Props) {
		console.log("in SCU", nextProps)
		if (this.props.router.location !== nextProps.router.location) {
			console.log("location changed!")
			console.log(nextProps.router.location)
			this.registrationWizard = RegistrationWizard(nextProps.state)
		}
		return true
	}
	render() {
		console.log("=========================================== in app render")
//		console.log(this.props.state.router.location)
		const self = this;
		const devTools = (!this.props.isServer) ? (function(){
			const DevTools = require('../core/DevTools').default;	// TODO: should be import?
			return <DevTools />;
		}()) : undefined;
//		console.log(this.props)
		//const path = this.props.router.pathname


		const isLoggedIn = !!self.props.login && !!self.props.login.authenticatedUserName;

//		console.log("about to evaluate route: ", this.props.history)
	//	console.log("router.location", this.props.router.location)

		const ret = (
			<div>
				<JoomlaBase>
					{router(self.props.history, isLoggedIn, this.props.serverSideResolveOnAsyncComplete, this.clientSideAsyncResult)}
					{devTools}
				</JoomlaBase>
			</div>
		);
		this.clientSideAsyncResult = null;

		return ret;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
