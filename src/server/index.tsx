import * as express from "express"
import * as React from "react"
import { renderToString } from "react-dom/server"
import { StaticRouter, matchPath } from "react-router-dom"
import { Provider } from 'react-redux';
const { routerForExpress } = require('redux-little-router');

import App from '../containers/App'
import createStore from '../createStore'
import * as counterReducer from '../reducer'
import routes from '../routes'

const app = express()

app.use(express.static("dist"))

app.get("*", (req, res, next) => {

  const { reducer, middleware, enhancer } = routerForExpress({
    routes,
    request: req
  });


  const store = createStore({
    reducers: { router: reducer, counter: counterReducer },
    enhancers: [enhancer],
    middlewares: [middleware],
    addDevTools: false
  });


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
          <script src="/js/client.js" defer></script>
        </head>
        <body>
          <div id="app">${markup}</div>
        </body>
      </html>
    `)
})

app.listen(3000, () => {
  console.log(`Server is listening on port: 3000`)
})
