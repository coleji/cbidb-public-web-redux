import * as express from "express"
import * as React from "react"
import { renderToString } from "react-dom/server"
import { Provider } from 'react-redux';
const { routerForExpress } = require('redux-little-router');
import {Helmet} from "react-helmet";

import App from '../containers/App'
import createStore from '../createStore'
import * as counterReducer from '../reducer/globalReducer'
import routes from '../routes'

const app = express()

app.use(express.static("dist"))

app.get("*", (req, res, next) => {

  const { reducer, middleware, enhancer } = routerForExpress({
    routes,
    request: req
  });


  const store = createStore({
    reducers: { router: reducer, counter: counterReducer, isServer: () => true },
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
