import { MakeAPIRequest } from "./async";

export const loginAction = (makeAPIRequest: MakeAPIRequest, dispatch: (action: any) => void, userName: string, password: string) => makeAPIRequest({
    path: "/api/authenticate-member",
    httpMethod: "POST",
	postData: "username=" + encodeURIComponent(userName) + "&password=" + encodeURIComponent(password),
	extraHeaders: {"dont-redirect": "true"},
	postContentIsFormURLEncoded: true
})
// .then(response => new Promise((resolve, reject) => {
// 	try {
// 		resolve(JSON.parse(response))
// 	} catch (e) {
// 		reject(e)
// 	}
// })
.then(data => {
	console.log("login result: ", data)
	if (String(data) == "false") {
		dispatch({type: "LOGIN_FAILURE"})
	} else {
		console.log("about to query welcome pkg")
		return makeAPIRequest({
			path: "/api/member-welcome",
			httpMethod: "GET"
		})
		.then(response => new Promise((resolve, reject) => {
			try {
				resolve(JSON.parse(response))
			} catch (e) {
				reject(e)
			}
		}))
		.then(data => {
			console.log("welcome package: ", data)
			dispatch({type: "LOGIN_SUCCESS", userName})
			dispatch({type: "WELCOME_PKG_UPDATE", ...((<any>data).data)})
		})	
	}
})
.catch((e) => {
    console.log("error: ", e)
    dispatch({type: "LOGIN_FAILURE"})
})
