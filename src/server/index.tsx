import * as express from "express"
import * as React from "react"
import { renderToString } from "react-dom/server"
import { StaticRouter, matchPath } from "react-router-dom"
import { Provider } from 'react-redux';

import App from '../containers/App'
import createStore from '../createStore'

const app = express()

app.use(express.static("dist"))

app.get("*", (req, res, next) => {
	const promise = Promise.resolve()
	const store = createStore(null);

	promise.then((data) => {
		const context = { data }

		const markup = renderToString(
			<Provider store={store}>
			<StaticRouter location={req.url} context={{}}>
				<App />
			</StaticRouter>
			</Provider>
		)

		res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SSR with RR</title>
          <script src="js/client.js" defer></script>
        </head>
        <body>
          <div id="app">${markup}</div>
        </body>
      </html>
    `)
	}).catch(next)
})

app.listen(3000, () => {
	console.log(`Server is listening on port: 3000`)
})

/*
  1) Just get shared App rendering to string on server then taking over on client.
  2) Pass data to <App /> on server. Show diff. Add data to window then pick it up on the client too.
  3) Instead of static data move to dynamic data (github gists)
  4) add in routing.
*/