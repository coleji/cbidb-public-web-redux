import {createActionFromAPIResponse} from './async'

export const loginAction = (dispatch: any, username: string, password: string) => createActionFromAPIResponse({
    apiEndpoint: "/api/authenticate-member",
    httpMethod: "POST",
	postData: "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password),
	extraHeaders: {"dont-redirect": "true"},
	config: {
		apiHost: "workstation.community-boating.org", //TODO: make into config
		apiPort: 443, //TODO: make into config
		host: "workstation.community-boating.org", //TODO: make into config
		port: 443, //TODO: make into config
		isBehindReverseProxy: false //TODO: make into config
	},
	dispatch
}).then(() => dispatch({type: "LOGIN_SUCCESS"}))
.catch((e) => {
    console.log("error: ", e)
    dispatch({type: "LOGIN_FAILURE"})
})
