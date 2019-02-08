require("../../lib/array-polyfill")
require("../../lib/optional")

import * as express from "express"
import * as React from "react"
import { renderToString } from "react-dom/server"
import { Provider } from 'react-redux';
import { Helmet } from "react-helmet";
import * as httpProxy from 'http-proxy';
import * as cookieParser from 'cookie-parser';
import * as moment from "moment";
import { routerMiddleware } from 'connected-react-router'
import { createMemoryHistory } from 'history'

import App from '../containers/App'
import createStore from '../createStore'
import { makeRootReducer, StaticState } from '../reducer/rootReducer'
import routes from '../routes'
import { makeAPIRequest } from '../async/async';


const app = express();

app.use(cookieParser(""));

const apiDirectConnection = false

export const history = createMemoryHistory()

const targetUrl = 'http://localhost:3000'

if (!apiDirectConnection) {
	const proxy = httpProxy.createProxyServer({
		target: targetUrl,
		ws: true
	});

	//app.use(compression());

	//app.use(Express.static(path.join(__dirname, '..', 'static')));


	// Proxy to API server
	app.use('/api', (req, res) => {
		console.log("forwarding an api request to " + req.path)
		proxy.web(req, res, { target: targetUrl });
	});

	app.use('/ws', (req, res) => {
		proxy.web(req, res, { target: targetUrl + '/ws' });
	});

	/*server.on('upgrade', (req, socket, head) => {
		proxy.ws(req, socket, head);
	});*/

	// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
	proxy.on('error', (error: any, req, res) => {
		let json;
		if (error.code !== 'ECONNRESET') {
			console.error('proxy error', error);
		}
		if (!res.headersSent) {
			res.writeHead(500, { 'content-type': 'application/json' });
		}

		json = { error: 'proxy_error', reason: error.message };
		res.end(JSON.stringify(json));
	});
}

app.use(express.static("dist"))
app.use(express.static("public"))

app.get("*", (req, res, next) => {
	console.log("cookie is " + req.cookies["CBIDB-SEC"])
	makeAPIRequest({
		https: false,
		apiEndpoint: "/member-welcome",
		httpMethod: "GET",
		host: "localhost", //TODO: make into config
		port: 3000, //TODO: make into config
		isBehindReverseProxy: false, //TODO: make into config
		extraHeaders: {
			"Cookie": "CBIDB-SEC=" + req.cookies["CBIDB-SEC"]
		}
	})
	// TODO: dont autodetect if the response is a JSON with a `data` property
	// Come up with a better arch for this.  Seems like everything should be a JSON, no more text responses
	.then((json: any) => {
		console.log("got ", json)
		if (json && json.data && json.data.userName) {
			return Promise.resolve({
				login: {authenticatedUserName: json.data.userName},
				welcomePackage: json.data
			});
		} else Promise.resolve({})
	}, (e) => {
		console.log("server side get welcome pkg failed", e)
		Promise.resolve({})
	})
	.then(seedState => {
		const staticState: StaticState = {
			getMoment:  () => moment(),
			isServer: true,
			jpDirectorNameFirst: "Niko",
			jpDirectorNameLast: "Kotsatos",
			jpDirectorEmail: "niko@community-boating.org"
		}
		const rootReducer = makeRootReducer(history, staticState)

		const {store, initialState}  = createStore({
			rootReducer,
			enhancers: [],
			middlewares: [routerMiddleware(history)],
			seedState: {
				...seedState,
				staticState
			}
		});


		const markup = renderToString(
			<Provider store={store}>
				<App history={history}/>
			</Provider>
		)
		const helmet = Helmet.renderStatic();

		res.send(`
	<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-gb" lang="en-gb">
		<head>
		${helmet.title.toString()}
		${helmet.meta.toString()}
		${helmet.link.toString()}
		${helmet.script.toString()}
		<script src="/js/client.js" defer></script>
		<script>
		var initialStateFromServer = ${JSON.stringify(initialState)}
		</script>
		</head>
		<body class="main-overlay-dark primary-overlay-dark readonstyle-button font-family-momentum font-size-is-default logo-enabled-1 logo-style-light menu-type-fusionmenu typography-style-light col12 menu-resources  option-com-content view-article">
		<div id="app">${markup}</div>
		</body>
	</html>
	`)
	})
})

app.listen(8080, () => {
	console.log(`Server is listening on port: 8080`)
})
