import * as http from 'http';
import { string, number } from 'prop-types';

interface MakeAPIRequestParams {
	host: string,
	port: number,
	isBehindReverseProxy: boolean,
	apiEndpoint: string,
	httpMethod: string,
	postData?: string
}

interface CreateActionFromAPIResponseParams {
	apiEndpoint: string,
	httpMethod: string,
	postData?: string,
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
			path: '/api' + params.apiEndpoint,
			method: params.httpMethod,
			headers: <any>{ }
		};
		if (params.httpMethod == 'POST') {
			options.headers['Content-Type'] = 'application/json';
			options.headers['Content-Length'] = JSON.stringify(params.postData).length;
		}

		let req = http.request(options, (res: any) => {
			let resData = '';
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
			req.write(JSON.stringify(params.postData));
		}
		req.end();
	});
};

var createActionFromAPIResponse = function(params: CreateActionFromAPIResponseParams) {
	return new Promise((resolve, reject) => {
		makeAPIRequest({
			apiEndpoint: params.apiEndpoint,
			httpMethod: params.httpMethod,
			postData: params.postData,
			host : params.config.apiHost || params.config.host,
			port : params.config.apiPort || params.config.port,
			isBehindReverseProxy : params.config.isBehindReverseProxy
		})
		.then((json: any) => {
			let data = json.data;
			if (params.dataForEach) data.forEach(params.dataForEach);
			if (params.dispatch && data && data.sessionExpired) {
				params.dispatch({
					type: "LOGOUT"
				});
				reject("Session expired.");
			} else resolve(data);
		}).catch((e) => {
			reject(e);
		});
	});
};

export {
	makeAPIRequest,
	createActionFromAPIResponse
};