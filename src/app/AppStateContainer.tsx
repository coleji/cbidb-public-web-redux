import * as React from 'react';
import { Option, none } from 'fp-ts/lib/Option';
import { PostString } from '../core/APIWrapper';
import {apiw} from "../async/authenticate-member"
import { getReduxState } from "../core/reducer/store";

type State = {
	login: {
		authenticatedUserName: Option<string>
	}
}

export default class AppStateContainer extends React.PureComponent<{}, State> {
	updateState = {
		login: {
			attemptLogin: function(userName: string, password: string): Promise<boolean> {
				const payload = PostString("username=" + encodeURIComponent(userName) + "&password=" + encodeURIComponent(password))
				return apiw.send(getReduxState().staticState.serverToUseForAPI)(payload).then(x => {
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
		}
	}
	constructor(props: {}) {
		super(props);
		this.state = {
			login: {
				authenticatedUserName: none
			}
		};
	}
}