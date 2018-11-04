import {createActionFromAPIResponse} from './async'

export const loginAction = (dispatch: any, username: string, password: string) => createActionFromAPIResponse({
    apiEndpoint: "/authenticate",
    httpMethod: "POST",
    postData: "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password),
	config: {
		apiHost: "localhost",
		apiPort: 3000,
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
