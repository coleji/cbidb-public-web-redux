import {createActionFromAPIResponse} from './async'

export const loginAction = (dispatch: any, username: string, password: string) => createActionFromAPIResponse({
    apiEndpoint: "/api/authenticate",
    httpMethod: "POST",
	postData: "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password),
	extraHeaders: {"dont-redirect": "true"},
	config: {
		apiHost: "localhost",
		apiPort: 8080,
		host: "localhost",
		port: 8080,
		isBehindReverseProxy: false
	},
	dispatch
}).then(() => dispatch({type: "LOGIN_SUCCESS"}))
.catch((e) => {
    console.log("error: ", e)
    dispatch({type: "LOGIN_FAILURE"})
})
