import * as React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router';

import Gatekeeper from "./containers/create-acct/Gatekeeper";
import CreateAccount from './containers/create-acct/CreateAccount';
import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';
import RatingsPage from './containers/RatingsPage';
import RegistrationWizard, { path as registrationWizardPath } from './containers/registration/pageflow/RegistrationWizard';
import SelectClassType, { path as selectClassTypePath } from "./containers/class-signup/SelectClassType"
import SelectClassTime, { path as selectClassTimePath, path } from "./containers/class-signup/SelectClassTime"
import { History } from 'history';
import PageWrapper from './components/Page/PageWrapper';
import extractURLParams from './util/extractURLParams';
import {Form as HomePageForm} from "./containers/HomePage"
import {apiw as welcomeAPI} from "./async/member-welcome"
import { getReduxState } from './core/reducer/store';

export default function (history: History<any>, isLoggedIn: boolean) {
	function pathAndParamsExtractor<T>(path: string) {
		return {
			path,
			getParams: extractURLParams<T>(path)
		}
	}

	const paths = {
		ratings: pathAndParamsExtractor<{personId: number}>("/ratings/:personId")
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
			component={(async: HomePageForm) => <RatingsPage
				history={history}
				welcomePackage={async}
				personId={paths.ratings.getParams(history.location.pathname).personId}
			/>}
			shadowComponent={<span>hi!</span>}
			getAsyncProps={() => {
				return welcomeAPI.send(getReduxState().staticState.selfServerParams)(null).then((result: string) => {
					console.log("Got result from api: ", result.substr(0,50))
					const parsedResult = welcomeAPI.parseResponse(result)
					if (parsedResult.type == "Success") {
						return Promise.resolve(parsedResult.result)
					} else {
						console.log(parsedResult.failureType)
						console.log(parsedResult.err)
						return Promise.reject(parsedResult.failureType)
					}
					// set form to result from api
					
				}).catch(err => {
					console.log("Error: ", err)
				})
			}}
		/>} />,
		<Route key="class" path={selectClassTypePath} render={() => <SelectClassType />} />,
		<Route key="classTime" path={selectClassTimePath} render={() => <SelectClassTime />} />,
		<Route key="reg" exact path={registrationWizardPath} render={() => {
			const Clazz = this.registrationWizard
			return <Clazz />
		}} />,
		//...RegistrationTransparentFlow(this.props.dispatch).routes,
		<Route key="default" render={() => <HomePage />} />
	]

//	const isLoggedIn = false; // self.props.login && self.props.login.authenticatedUserName;

	const authedDependedRoutes = isLoggedIn ? mustBeLoggedIn : mustNotBeLoggedIn

	return (<Router history={history}>
		<Switch>
			{...authedDependedRoutes}
		</Switch>
	</Router>);
} 