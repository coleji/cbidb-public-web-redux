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

import App from '../../containers/App'
import createStore from '../createStore'
import { makeRootReducer, StaticState } from '../../rootReducer'
import getConfig from './config'
import {setStore} from "../reducer/store"
import memberWelcome from "../../async/member-welcome"
import { ServerParams } from "../APIWrapper";
import { some, none } from "fp-ts/lib/Option";

require("../../../lib/array-polyfill")

const app = express();

app.use(cookieParser(""));

app.use(express.static("dist"))
app.use(express.static("public"))

var Global: {[K: string]: any} = {};


getConfig.then(serverConfig => {
	const targetUrl = [
		serverConfig.API.https ? 'https' : 'http',
		"://",
		serverConfig.API.host,
		":",
		serverConfig.API.port || (serverConfig.API.https ? 443 : 80)
	].join("")

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

	app.get("/favicon.ico", (req, res, next) => {
		res.status(404).send("");
	})

	app.get("*", (req, res, next) => {
		console.log(" //////////////////////////////////////   server just received a request:  ", req.path)
		console.log("cookie is " + req.cookies["CBIDB-SEC"])
		const selfServerParams: ServerParams = {
			...serverConfig.SELF,
			port: (serverConfig.SELF.https ? 443 : 80)
		}
		const apiServerParams: ServerParams = {
			...serverConfig.API,
			staticHeaders: req.cookies["CBIDB-SEC"] ? { "Cookie": "CBIDB-SEC=" + req.cookies["CBIDB-SEC"] } : {}
		}
		memberWelcome(apiServerParams)
		.then((response: any) => JSON.parse(response))
		// TODO: dont autodetect if the response is a JSON with a `data` property
		// Come up with a better arch for this.  Seems like everything should be a JSON, no more text responses
		.then((json: any) => {
			if (json && json.userName) {
				return Promise.resolve({
					login: {authenticatedUserName: json.userName},	// TODO: should be option?
					homePageForm: { data: some(json) }
				});
			} else Promise.resolve({})
		}, (e) => {
			console.log("server side get welcome pkg failed", e)
			Promise.resolve({})
		})
		.then(seedState => new Promise<{}>((resolve, reject) => {
			console.log("about to create store server side")
			const history = createMemoryHistory({
				initialEntries: [req.path]
			});
			const staticState: StaticState = {
				getMoment:  () => moment(),
				isServer: true,
				jpDirectorNameFirst: "Niko",
				jpDirectorNameLast: "Kotsatos",
				jpDirectorEmail: "niko@community-boating.org",
				jpPriceCents: 32500,	// TODO: get from welcome pkg
				currentSeason: 2019,
				apiServerParams: apiServerParams,
				selfServerParams: selfServerParams,
				serverConfig,
				serverToUseForAPI: apiServerParams
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

			Global["initialState"] = initialState;

			setStore(store);

			Global["store"] = store;
			Global["history"] = history;
			Global["asyncResult"] = null;
			Global["makeProvider"] = () => (
				<Provider store={Global["store"]}>
					<App history={Global["history"]} resolveOnAsyncComplete={resolve as any} asyncResult={Global["asyncResult"]}/>
				</Provider>
			);




			// trigger the components to actually attempt a render
			renderToString(Global["makeProvider"]());

			console.log("server side, triggered a render of App")

			console.log("did all the server things, waiting on that resolve.....")
			
		})).then((asyncResult: any) => {
			console.log("asyncResutl is ", asyncResult)
			Global["asyncResult"] = asyncResult;
			Global["initialState"].asyncResult = asyncResult;
			delete Global["initialState"].staticState.apiServerParams;
			Global["initialState"].staticState.serverToUseForAPI = selfServerParams
			const helmet = Helmet.renderStatic();

			console.log("here we go final render trigger...")
			console.log("strignifying intial state: ", Global["initialState"] )

			const resString = `
			<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
			<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-gb" lang="en-gb">
				<head>
				${helmet.title.toString()}
				${helmet.meta.toString()}
				${helmet.link.toString()}
				${helmet.script.toString()}
				<script src="/js/client.js" defer></script>
				<script>
				var initialStateFromServer = ${JSON.stringify(Global["initialState"])}
				</script>
				</head>
				<body class="main-overlay-dark primary-overlay-dark readonstyle-button font-family-momentum font-size-is-default logo-enabled-1 logo-style-light menu-type-fusionmenu typography-style-light col12 menu-resources  option-com-content view-article">
				<div id="app">${renderToString(Global["makeProvider"]())}</div>
				</body>
			</html>
			`;

			console.log("##############################################################")
			console.log("##############################################################")
			console.log("############           SERVER IS DONE           ##############")
			console.log("##############################################################")
			console.log("##############################################################")
	
			res.send(resString)
		})
		.catch(e => {
			console.log("Error: ", e)
		})
	})
	app.listen(8080, () => {
		console.log(`Server is listening on port: 8080`)
	})
	
}, err => {
	console.log("Config parse failed: ", err)
})
