import * as React from 'react';
import { Option, none, some } from 'fp-ts/lib/Option';
import { PostString, ServerParams } from '../core/APIWrapper';
import {apiw} from "../async/authenticate-member"
import { ServerConfig } from '../core/server/config';
import App from '../containers/App';
import states from '../lov/states';

export interface AppProps {
	isServer: boolean,
	jpDirectorNameFirst: string,
	jpDirectorNameLast: string,
	jpDirectorEmail: string,
	jpPriceCents: number,
	currentSeason: number,
	apiServerParams: ServerParams,
	selfServerParams: ServerParams,
	serverConfig: ServerConfig,
	serverToUseForAPI: ServerParams
}

type State = {
	appProps: AppProps
	login: {
		authenticatedUserName: Option<string>
	}
}

class AppStateContainer {
	state: State
	setState = (state: State) => {
		this.state = state;
		if (this.listener) this.listener();
	}
	listener: () => void
	setListener=(listener: () => void) => {
		this.listener = listener
	}
	updateState = {
		login: {
			setLoggedIn: (function(userName: string) {
				const self: AppStateContainer = this
				self.setState({
					...self.state,
					login: {
						...self.state.login,
						authenticatedUserName: some(userName)
					}
				})
			}).bind(this),
			attemptLogin: (function(userName: string, password: string): Promise<boolean> {
				const self: AppStateContainer = this
				const payload = PostString("username=" + encodeURIComponent(userName) + "&password=" + encodeURIComponent(password))
				return apiw().send(self.state.appProps.serverToUseForAPI)(payload).then(isAuthenticated => {
					if (isAuthenticated == "true") {
						self.updateState.login.setLoggedIn(userName);
						return true;
					} else return false;
				})
			}).bind(this),
			logout: () => {
				this.setState({
					...this.state,
					login: {
						authenticatedUserName: none
					}
				})
			}
		},
		appProps: (appProps: AppProps) => {
			this.setState({
				...this.state,
				appProps
			})
		}
	}
	constructor() {
		this.state = {
			appProps: null,
			login: {
				authenticatedUserName: none
			}
		};
	}
}

const asc = new AppStateContainer();
export default asc;