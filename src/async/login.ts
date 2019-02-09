import {createActionFromAPIResponse} from './async'

export const loginAction = (dispatch: (action: any) => void, userName: string, password: string) => createActionFromAPIResponse({
	https: true,
    apiEndpoint: "/api/authenticate-member",
    httpMethod: "POST",
	postData: "username=" + encodeURIComponent(userName) + "&password=" + encodeURIComponent(password),
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
		console.log("about to query welcome pkg")
		return createActionFromAPIResponse({
			https: true,
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
			dispatch({type: "LOGIN_SUCCESS", userName})
			dispatch({type: "WELCOME_PKG_UPDATE", ...data})
		})	
	}
})
.catch((e) => {
    console.log("error: ", e)
    dispatch({type: "LOGIN_FAILURE"})
})
