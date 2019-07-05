import * as React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router';
import * as t from 'io-ts'
import Gatekeeper from "./containers/create-acct/Gatekeeper";
import CreateAccount from './containers/create-acct/CreateAccount';
import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';
import RatingsPage from './containers/RatingsPage';
//import RegistrationWizard, { path as registrationWizardPath } from './containers/registration/pageflow/RegistrationWizard';
import SelectClassType, { path as selectClassTypePath } from "./containers/class-signup/SelectClassType"
import SelectClassTime, { path as selectClassTimePath, path } from "./containers/class-signup/SelectClassTime"
import { History } from 'history';
import PageWrapper from './components/Page/PageWrapper';
import extractURLParams from './util/extractURLParams';
import {Form as HomePageForm} from "./containers/HomePage"
import RequiredInfo from "./containers/registration/RequiredInfo"
import {apiw as welcomeAPI} from "./async/member-welcome"
import {getWrapper as requiredInfoAPI, validator as requiredInfoValidator} from "./async/junior/required"
import {getWrapper as emergContactAPI, validator as emergContactValidator} from "./async/junior/emerg-contact"
import {getWrapper as surveyAPI, validator as surveyValidator} from "./async/junior/survey"
import EmergencyContact from './containers/registration/EmergencyContact';
import SurveyInfo from './containers/registration/SurveyInfo';
import TermsConditions from './containers/registration/TermsConditions';

export interface AutoResolver {
	clientSideAsyncResult: any,
	serverSideResolveOnAsyncComplete: (clientSideAsyncResult: any) => void,
	autoResolve: () => void
}

// Some pages have a "shadowComponent" which is the thing to render while we are waiting async for API to come back, 
// so we can then render the real shit with fresh API data.
//
// SERVER SIDE:
// The server index.ts (ie that has all the express stuff) will instantiate <App />, but it will pass App this `serverSideResolveOnAsyncComplete` function
// The call to instantiate <App /> is within a promise, and `serverSideResolveOnAsyncComplete` is the resolve of that promise.
// I.e. in order to get the server to actually complete a request, <App /> must at some point call serverSideResolveOnAsyncComplete
// The purpose of this is to prevent the server from completing the request when an API-dependent page has only rendered the shadowComponent
// This routing component will do two things:
//		1) If the thing we want to render is not API-dependent, we will render and then call `serverSideResolveOnAsyncComplete` immediately
//		2) If it is API-dependent, we will trigger the API call, render the shadow, wait around indefinitely, and then once API comes back we call `serverSideResolveOnAsyncComplete`
//
// CLIENT SIDE:
// If this is the first client-side render of an API-blocked component, then presumably the server did all the above stuff and already talked to API for us.
// If that happened, then `clientSideAsyncResult` will be non-null and we can (TS-unsafely) assume that its contents are exactly the api-blocked parameters
// of the page we want to render.  So stick that stuff in the AsyncResolver we hand to the PageWrapper, and when it goes to render and sees stuff in there,
// it will blindly use it and not call API.
// Client-side we still have `serverSideResolveOnAsyncComplete` being passed around all over the place but it is a () => {} function that nobody cares about
export default function (history: History<any>, isLoggedIn: boolean, serverSideResolveOnAsyncComplete: (clientSideAsyncResult: any) => void, clientSideAsyncResult: any) {
	console.log("inside routing function")
	var asyncResolver: AutoResolver = {
		clientSideAsyncResult,
		serverSideResolveOnAsyncComplete: serverSideResolveOnAsyncComplete,
		autoResolve: () => {
			// This structure means the default serverside behavior is to always call `serverSideResolveOnAsyncComplete` after the initial render
			// (i.e. eliminates the possibility that for a particular URL you just forgot to ever call it)
			// unless someone explicitly goes out of their way to stomp on this function with a fn that does nothing
			// If you do that, you're on the hook for actually calling `serverSideResolveOnAsyncComplete` manually when you're ready
			// otherwise the server will never complete the request
			// In reality <PageWrapper /> should be the only thing that ever stomps on this function and manually calls `serverSideResolveOnAsyncComplete`
			console.log("about to permit an autoresolve, this aint no async thing")
			serverSideResolveOnAsyncComplete(null)
		}
	};
	function pathAndParamsExtractor<T extends {[K: string]: string}>(path: string) {
		return {
			path,
			getParams: extractURLParams<T>(path)
		}
	}

	const paths = {
		ratings: pathAndParamsExtractor<{personId: string}>("/ratings/:personId"),
		reg: pathAndParamsExtractor<{personId: string}>("/reg/:personId"),
	}

	const mustNotBeLoggedIn = [
		<Route key="/precreate" path="/precreate" render={() => <Gatekeeper />} />,
		<Route key="/create-acct" path="/create-acct" render={() => <CreateAccount />} />,
		<Route key="login" path="/login" render={() => <LoginPage />} />,
		<Route key="default" render={() => <Redirect to="/login" />} />,
	]

	const mustBeLoggedIn = [
		<Route key="login" path="/login" render={() => <Redirect to="/" />} />,
		<Route key="ratings" path={paths.ratings.path} render={() => <PageWrapper
			component={(urlProps: {personId: number}, async: HomePageForm) => <RatingsPage
				history={history}
				welcomePackage={async}
				personId={urlProps.personId}
			/>}
			urlProps={{personId: Number(paths.ratings.getParams(history.location.pathname).personId)}}
			shadowComponent={<span>hi!</span>}
			getAsyncProps={() => {
				return welcomeAPI.do().catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
			asyncResolver={asyncResolver}
		/>} />,
		<Route key="class" path={selectClassTypePath} render={() => <SelectClassType />} />,
		<Route key="classTime" path={selectClassTimePath} render={() => <SelectClassTime />} />,
		// <Route key="reg" exact path={registrationWizardPath} render={() => {
		// 	const Clazz = this.registrationWizard
		// 	return <Clazz />
		// }} />,
		// <Route key="reg" path={paths.reg.path} render={() => <PageWrapper
		// 	component={(urlProps: {personId: number}, async: t.TypeOf<typeof requiredInfoValidator>) => <RequiredInfo
		// 		history={history}
		// 		initialFormData={async}
		// 		{...urlProps}
		// 	/>}
		// 	urlProps={{personId: Number(paths.reg.getParams(history.location.pathname).personId)}}
		// 	shadowComponent={<span>hi!</span>}
		// 	getAsyncProps={(urlProps: {personId: number}) => {
		// 		return requiredInfoAPI(urlProps.personId).do().catch(err => Promise.resolve(null));  // TODO: handle failure
		// 	}}
		// 	asyncResolver={asyncResolver}
		// />} />,
		// <Route key="reg" path={paths.reg.path} render={() => <PageWrapper
		// 	component={(urlProps: {personId: number}, async: t.TypeOf<typeof emergContactValidator>) => <EmergencyContact
		// 		history={history}
		// 		initialFormData={async}
		// 		{...urlProps}
		// 	/>}
		// 	urlProps={{personId: Number(paths.reg.getParams(history.location.pathname).personId)}}
		// 	shadowComponent={<span>hi!</span>}
		// 	getAsyncProps={(urlProps: {personId: number}) => {
		// 		return emergContactAPI(urlProps.personId).do().catch(err => Promise.resolve(null));  // TODO: handle failure
		// 	}}
		// 	asyncResolver={asyncResolver}
		// // />} />,
		// <Route key="reg" path={paths.reg.path} render={() => <PageWrapper
		// 	component={(urlProps: {personId: number}, async: t.TypeOf<typeof surveyValidator>) => <SurveyInfo
		// 		history={history}
		// 		initialFormData={async}
		// 		{...urlProps}
		// 	/>}
		// 	urlProps={{personId: Number(paths.reg.getParams(history.location.pathname).personId)}}
		// 	shadowComponent={<span>hi!</span>}
		// 	getAsyncProps={(urlProps: {personId: number}) => {
		// 		return surveyAPI(urlProps.personId).do().catch(err => Promise.resolve(null));  // TODO: handle failure
		// 	}}
		// 	asyncResolver={asyncResolver}
		// />} />,
		<Route key="reg" path={paths.reg.path} render={() => <PageWrapper
			component={() => <TermsConditions
				history={history}
			/>}
			urlProps={{}}
			shadowComponent={<span>hi!</span>}
			asyncResolver={asyncResolver}
		/>} />,
		<Route key="default" render={() => <HomePage />} />
	]

//	const isLoggedIn = false; // self.props.login && self.props.login.authenticatedUserName;

	const authedDependedRoutes = isLoggedIn ? mustBeLoggedIn : mustNotBeLoggedIn

	class AutoResolveTriggerComponent extends React.PureComponent {
		// In order for things to happen in the right order,
		// i.e. to give the page component an opportunity to stomp on the autoResolve function before it is actually called,
		// the call need to be in the render of a BS component that renders after <Router /> 
		render() {
			console.log("rerendering router component")
			console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%% calling autoresolve");
			asyncResolver.autoResolve();
			return ""
		}
	}

	console.log("routing function returning Router component")
	return (
		<React.Fragment>
			<Router history={history}>
				<Switch>
					
					{...authedDependedRoutes}
				</Switch>
			</Router>
			<AutoResolveTriggerComponent />
		</React.Fragment>
	);
} 