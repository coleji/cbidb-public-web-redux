import * as React from 'react';
import { Option, none } from 'fp-ts/lib/Option';
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
	setState = (state: State) => this.state = state;
	updateState = {
		login: {
			attemptLogin: function(userName: string, password: string): Promise<boolean> {
				const payload = PostString("username=" + encodeURIComponent(userName) + "&password=" + encodeURIComponent(password))
				return apiw().send(this.state.appProps.serverToUseForAPI)(payload).then(x => {
					console.log("CALLED LOGIN: ", x);
					return true;
				})
			},
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