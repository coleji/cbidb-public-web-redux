import * as http from 'http';

interface MakeAPIRequestParams {
	host: string,
	port: number,
	isBehindReverseProxy: boolean,
	apiEndpoint: string,
	httpMethod: string,
	postData?: any,
	postFormat?: string,
	extraHeaders?: any
}

interface CreateActionFromAPIResponseParams {
	apiEndpoint: string,
	httpMethod: string,
	postData?: any,
	postFormat?: string,
	extraHeaders?: any,
	config: {
		apiHost: string,
		apiPort: number,
		host: string,
		port: number,
		isBehindReverseProxy: boolean,
	},
	dataForEach?: any,
	dispatch: any
}

var makeAPIRequest = function(params: MakeAPIRequestParams) {
	return new Promise((resolve, reject) => {
		let options = {
			hostname: params.host,
			port: (params.isBehindReverseProxy ? 80 : params.port),
			path: params.apiEndpoint,
			method: params.httpMethod,
			headers: <any>{ }
		};

		if (params.httpMethod == 'POST') {
			if (params.postFormat == "JSON") {
				options.headers['Content-Type'] = 'application/json';
				options.headers['Content-Length'] = JSON.stringify(params.postData).length;
			} else {
				options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
				options.headers['Content-Length'] = params.postData.length;
			}
			
		}

		for (var p in params.extraHeaders || {}) {
			options.headers[p] = params.extraHeaders[p];
		}

		let req = http.request(options, (res: any) => {
			let resData = '';
			//console.log("API RESPONSE: ", res)
			res.on('data', (chunk: any) => {
				resData += chunk;
			});
			res.on('end', () => {
				let response = JSON.parse(resData);
				resolve(response);
			});
		});
		req.on('error', (e: string) => {
			reject(e);
		});

		if (params.httpMethod == 'POST') {
			if (params.postFormat == "JSON") {
				req.write(JSON.stringify(params.postData));
			} else {
				req.write(params.postData);
			}
		}
		req.end();
	});
};

var createActionFromAPIResponse = function(params: CreateActionFromAPIResponseParams) {
	return new Promise((resolve, reject) => {
		console.log("starting api call")
		makeAPIRequest({
			apiEndpoint: params.apiEndpoint,
			httpMethod: params.httpMethod,
			postData: params.postData,
			host : params.config.apiHost || params.config.host,
			port : params.config.apiPort || params.config.port,
			isBehindReverseProxy : params.config.isBehindReverseProxy,
			extraHeaders: params.extraHeaders
		})
		// TODO: dont autodetect if the response is a JSON with a `data` property
		// Come up with a better arch for this.  Seems like everything should be a JSON, no more text responses
		.then((json: any) => {
			console.log("api success", json)
			let data = json.data;
			if (params.dataForEach) data.forEach(params.dataForEach);
			if (params.dispatch && data && data.sessionExpired) {
				params.dispatch({
					type: "LOGOUT"
				});
				reject("Session expired.");
			} else if (data) resolve(data);
			else resolve(json)
		}).catch((e) => {
			console.log("api failure")
			reject(e);
		});
	});
};

export {
	makeAPIRequest,
	createActionFromAPIResponse
};