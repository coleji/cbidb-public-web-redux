import * as express from "express"
import * as React from "react"
import { renderToString } from "react-dom/server"
import { Provider } from 'react-redux';
import { routerForExpress } from 'redux-little-router';
import {Helmet} from "react-helmet";
import * as httpProxy from 'http-proxy';

import App from '../containers/App'
import createStore from '../createStore'
import {makeRootReducer} from '../reducer/rootReducer'
import routes from '../routes'

const app = express()


const apiDirectConnection = false

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
		proxy.web(req, res, {target: targetUrl});
	});

	app.use('/ws', (req, res) => {
		proxy.web(req, res, {target: targetUrl + '/ws'});
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
			res.writeHead(500, {'content-type': 'application/json'});
		}

		json = {error: 'proxy_error', reason: error.message};
		res.end(JSON.stringify(json));
	});
}

app.use(express.static("dist"))

app.get("*", (req, res, next) => {

  const { reducer, middleware, enhancer } = routerForExpress({
    routes,
    request: req
  });

  const rootReducer = makeRootReducer(reducer, true)

  const store = createStore({
    rootReducer,
    enhancers: [enhancer],
    middlewares: [middleware]
  });


  const markup = renderToString(
    <Provider store={store}>
        <App />
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
        </head>
        <body class="main-overlay-dark primary-overlay-dark readonstyle-button font-family-momentum font-size-is-default logo-enabled-1 logo-style-light menu-type-fusionmenu typography-style-light col12 menu-resources  option-com-content view-article">
          <div id="app">${markup}</div>
        </body>
      </html>
    `)
})

app.listen(8080, () => {
  console.log(`Server is listening on port: 8080`)
})
