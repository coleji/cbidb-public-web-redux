import * as http from 'http';
import * as https from 'https';

export interface ServerParams {
	host: string,
	https: boolean,
	port?: number,
	pathPrefix?: string,
}

export interface RequestParams {
	httpMethod: "GET" | "POST", // TODO: support others?
	path: string,
	postContentIsFormURLEncoded?: boolean,
	postData?: string | object,
	extraHeaders?: object
}

export type MakeAPIRequest = (requestParams: RequestParams) => Promise<string>

export const makeHTTPRequest: (serverParams: ServerParams) => (staticHeaders: object) => (requestParams: RequestParams) => Promise<string> =
(serverParams: ServerParams) => staticHeaders => (requestParams: RequestParams) => {
	console.log("server params: ", serverParams)
	return new Promise((resolve, reject) => {
		interface PostValues {content: string, headers: {"Content-Type": string, "Content-Length": string}}
		const postValues: Optional<PostValues> = (function() {
			 if (requestParams.httpMethod == 'POST') {
				if (requestParams.postContentIsFormURLEncoded) {
					const data = (<string>requestParams.postData)
					return Some({
						content: data,
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
							"Content-Length": String(data.length)
						}
					})
				} else {
					const json = JSON.stringify(requestParams.postData)
					console.log(json)
					if (json == undefined) return None();
					else return Some({
						content: json,
						headers: {
							"Content-Type": "application/json",
							"Content-Length": String(json.length)
						}
					})
				}
			 } else return None();
		}())

		let options = {
			hostname: serverParams.host,
			port: (serverParams.port ? serverParams.port : (serverParams.https ? 443 : 80)),
			path: (serverParams.pathPrefix || "") + requestParams.path,
			method: requestParams.httpMethod,
			headers: <any>{
				...staticHeaders,
				...requestParams.extraHeaders,
				...postValues.map(v => v.headers).getOrElse(<any>{})
			}
		};
		
		console.log("making request to " + options.hostname + ":" + options.port + options.path)
		console.log(options)


		// TODO: should we embed the special case for logout directive on any response?  Seems heavy handed
		const reqCallback = (res: any) => {
			let resData = '';
			res.on('data', (chunk: any) => {
				resData += chunk;
			});
			res.on('end', () => {
				resolve(resData);
			});
		}

		const req = (
			serverParams.https
			? https.request(options, reqCallback)
			: http.request(options, reqCallback)
		)

		req.on('error', (e: string) => {
			reject(e);
		});


		postValues.map(v => v.content).forEach(v => req.write(v))

		req.end();
	});
}


// interface MakeAPIRequestParams {
// 	https: boolean,
// 	host: string,
// 	port: number,
// 	apiEndpoint: string,
// 	httpMethod: string,
// 	postData?: any,
// 	postFormat?: string,
// 	extraHeaders?: any
// }

// interface CreateActionFromAPIResponseParams {
// 	https: boolean,
// 	apiEndpoint: string,
// 	httpMethod: string,
// 	postData?: any,
// 	postFormat?: string,
// 	extraHeaders?: any,
// 	config: {
// 		apiHost: string,
// 		apiPort: number,
// 		host: string,
// 		port: number,
// 		isBehindReverseProxy: boolean,
// 	},
// 	dataForEach?: any,
// 	dispatch: any
// }

// var makeAPIRequest = function(params: MakeAPIRequestParams) {

// };

// var createActionFromAPIResponse = function(params: CreateActionFromAPIResponseParams) {
// 	return new Promise((resolve, reject) => {
// 		console.log("starting api call")
// 		makeAPIRequest({
// 			https: params.https,
// 			apiEndpoint: params.apiEndpoint,
// 			httpMethod: params.httpMethod,
// 			postData: params.postData,
// 			host : params.config.apiHost || params.config.host,
// 			port : params.config.apiPort || params.config.port,
// 			extraHeaders: params.extraHeaders
// 		}).then((response: any) => JSON.parse(response))
// 		// TODO: dont autodetect if the response is a JSON with a `data` property
// 		// Come up with a better arch for this.  Seems like everything should be a JSON, no more text responses
// 		.then((json: any) => {
// 			console.log("api success", json)
// 			let data = json.data;
// 			if (params.dataForEach) data.forEach(params.dataForEach);
// 			if (params.dispatch && data && data.sessionExpired) {
// 				params.dispatch({
// 					type: "LOGOUT"
// 				});
// 				reject("Session expired.");
// 			} else if (data) resolve(data);
// 			else resolve(json)
// 		}).catch((e) => {
// 			console.log("api failure")
// 			reject(e);
// 		});
// 	});
// };

// export {
// 	makeAPIRequest,
// 	createActionFromAPIResponse
// };
