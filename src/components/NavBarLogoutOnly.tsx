import * as React from "react";
import { push } from 'connected-react-router';
import { connect } from "react-redux";

import PlaceholderLink from "./PlaceholderLink";
import {getReduxState, getDispatch} from "../reducer/store"
import { RootState } from '../reducer/rootReducer';

export default () => (<React.Fragment>
	System Time:  <span id="systime">12:12:35 PM</span> (refresh your browser to update!)
	<PlaceholderLink>&nbsp;&nbsp;&nbsp;Adult Program</PlaceholderLink>
	<a href="#" onClick={() => {
		const makeAPIRequest = getReduxState().staticState.makeAPIRequest;
		makeAPIRequest({
			httpMethod: "POST",
			path: "/logout"
		}).then(() => getDispatch()({type: "LOGOUT"}))
	}}>&nbsp;&nbsp;&nbsp;Logout</a>
</React.Fragment>);