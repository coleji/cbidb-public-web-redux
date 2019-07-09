import * as React from 'react';
import { connect } from "react-redux";
import { Dispatch } from 'redux';
import { RootState } from '../rootReducer';
import JoomlaBase from '../theme/joomla/JoomlaBase';
import router from "../app/routing"
import AppStateContainer from '../app/AppStateContainer';
//import RegistrationTransparentFlow from "./registration/pageflow/RegistrationTransparentFlow"

// const mapStateToProps = (state: RootState) => ({
// 	state,
// 	router: state.router,
// 	isServer: state.staticState.isServer,
// 	login: state.login
// })


interface Props {
	history: any,
	serverSideResolveOnAsyncComplete: (clientSideAsyncResult: any) => {},
	clientSideAsyncResult: any,
	isServer: boolean
}

// TODO: make a wizard manager, call its update() in App constructor and SCU,
// wizard routes just call that route in the WM which returns HomePage if that route is not active in the WM
export default class App extends React.Component<Props> {
	clientSideAsyncResult: any
	registrationWizard: React.ComponentType
	constructor(props: Props) {
		super(props)
		console.log("in app constructor")
		console.log("asyncResult from server: ", this.props.clientSideAsyncResult)
		this.clientSideAsyncResult = this.props.clientSideAsyncResult;
	//	this.registrationWizard = RegistrationWizard(this.props.state)
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

//		console.log("about to evaluate route: ", this.props.history)
	//	console.log("router.location", this.props.router.location)

	const asc: AppStateContainer = new AppStateContainer({});

		const ret = (
			<JoomlaBase>
				{router(asc, self.props.history, this.props.serverSideResolveOnAsyncComplete, this.clientSideAsyncResult)}
				{devTools}
			</JoomlaBase>
		);
		this.clientSideAsyncResult = null;

		return ret;
	}
}
