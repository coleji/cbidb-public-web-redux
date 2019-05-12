import * as React from "react";

import PlaceholderLink from "./PlaceholderLink";
import {getReduxState, getDispatch} from "../reducer/store"
import {logout} from "../async/endpoints/logout"

export default () => (<React.Fragment>
	System Time:  <span id="systime">12:12:35 PM</span> (refresh your browser to update!)
	<PlaceholderLink>&nbsp;&nbsp;&nbsp;Adult Program</PlaceholderLink>
	<a href="#" onClick={() => {
		const apiServerParams = getReduxState().staticState.apiServerParams;
		logout.send(apiServerParams)(null).then(() => getDispatch()({type: "LOGOUT"}))
	}}>&nbsp;&nbsp;&nbsp;Logout</a>
</React.Fragment>);