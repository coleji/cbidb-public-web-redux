import {createActionFromAPIResponse} from './async'
import { LoginDispatch } from '../reducer/loginStateReducer';

export const loginAction = (dispatch: LoginDispatch) => createActionFromAPIResponse({
    apiEndpoint: "/api/authenticate-member",
    httpMethod: "POST",
	postData: "username=" + encodeURIComponent("") + "&password=" + encodeURIComponent(""),
	extraHeaders: {"dont-redirect": "true"},
	config: {
		apiHost: "workstation.community-boating.org", //TODO: make into config
		apiPort: 443, //TODO: make into config
		host: "workstation.community-boating.org", //TODO: make into config
		port: 443, //TODO: make into config
		isBehindReverseProxy: false //TODO: make into config
	},
	dispatch
}).then(data => {
	console.log("login result: ", data)
	if (String(data) == "false") {
		dispatch({type: "LOGIN_FAILURE"})
	} else {
		return createActionFromAPIResponse({
			apiEndpoint: "/api/member-welcome",
			httpMethod: "GET",
			config: {
				apiHost: "workstation.community-boating.org", //TODO: make into config
				apiPort: 443, //TODO: make into config
				host: "workstation.community-boating.org", //TODO: make into config
				port: 443, //TODO: make into config
				isBehindReverseProxy: false //TODO: make into config
			},
			dispatch
		}).then(data => {
			console.log("welcome package: ", data)
			dispatch({type: "LOGIN_SUCCESS", userName: ""})
		})	
	}
})
.catch((e) => {
    console.log("error: ", e)
    dispatch({type: "LOGIN_FAILURE"})
})
