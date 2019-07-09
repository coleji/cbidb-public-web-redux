import { none, some } from 'fp-ts/lib/Option';
import { createBrowserHistory } from 'history';
import * as http from "http";
import * as https from "https";
import * as React from 'react';
import { hydrate } from 'react-dom';

import asc, { AppProps } from '../app/AppStateContainer';
import App from '../containers/App';
import { replaceWithOption } from '../util/deserializeOption';

require("../../lib/array-polyfill")

const arr1 = ['a', 'b', 'c']
const arr2 = arr1.zipWithIndex()
console.log(arr2)
const s = some("tssdf")
const n = none
console.log(s.map(e => e.length))


export const history = createBrowserHistory()

const seedState = replaceWithOption((window as any).initialStateFromServer)

console.log("seedstate from server: ", seedState)

const appProps: AppProps = {
	...seedState.appProps,
	selfServerParams: {
		...seedState.appProps.serverConfig.SELF,
		makeRequest: (seedState.appProps.serverConfig.SELF.https ? https.request : http.request),
		port: (seedState.appProps.serverConfig.SELF.https ? 443 : 80)
	},
	apiServerParams: {
		...seedState.appProps.serverConfig.API,
		makeRequest: (seedState.appProps.serverConfig.API.https ? https.request : http.request),
	}
}

console.log("api https? ", seedState.appProps.serverConfig.SELF.https)

asc.updateState.appProps(appProps);

if (seedState && seedState.login && seedState.login.authenticatedUserName.isSome()) {
	asc.updateState.login.setLoggedIn(seedState.login.authenticatedUserName.getOrElse(null))
}

hydrate(
	<App
		history={history}
		serverSideResolveOnAsyncComplete={() => ({})}
		clientSideAsyncResult={seedState.clientSideAsyncResult}
		isServer={false}
	/>,
	document.getElementById('app')
);