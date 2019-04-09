import * as http from 'http';

export enum HttpMethod {
	GET = "GET",
	POST = "POST"
}

interface ConfigCommon<T_Success extends HasType, T_Fail extends HasType> {
	type: string & HttpMethod,
	path: string,
	extraHeaders: Optional<object>,
	parseServerResponse: (res: string) => (T_Success | T_Fail),
	parseRequestFailure: (err: string) => T_Fail
}

export interface GetConfig<T_Success extends HasType, T_Fail extends HasType> extends ConfigCommon<T_Success, T_Fail> {
	type: HttpMethod.GET,
}

export interface PostConfig<T_Success extends HasType, T_Fail extends HasType> extends ConfigCommon<T_Success, T_Fail> {
	type: HttpMethod.POST
}

export type Config<T_Success extends HasType, T_Fail extends HasType> = GetConfig<T_Success, T_Fail> | PostConfig<T_Success, T_Fail>;

export interface ServerParams {
	host: string,
	makeRequest: typeof http.request,
	port: number,
	pathPrefix?: string,
}

interface PostString {
	type: "urlEncoded",
	urlEncodedData: string
}

interface PostJSON<T> {
	type: "json",
	jsonData: T
}

type PostType<T> = PostString | PostJSON<T>

interface HasType {
	type: string
}

export default class APIWrapper<T_QueryJSON, T_Success extends HasType, T_Fail extends HasType> {
	config: Config<T_Success, T_Fail>
	constructor(config: Config<T_Success, T_Fail>) {
		this.config = config;
	}
	send: (serverParams: ServerParams) => (staticHeaders: object) => (data: PostType<T_QueryJSON>) => Promise<(T_Success | T_Fail)>
	= serverParams => staticHeaders => data => {
		const self = this;
		return new Promise((resolve, reject) => {
			interface PostValues {content: string, headers: {"Content-Type": string, "Content-Length": string}}
			const postValues: Optional<PostValues> = (function() {
				if (self.config.type === HttpMethod.POST) {
					if (data.type == "urlEncoded") {
						const postData = data.urlEncodedData
						return Some({
							content: postData,
							headers: {
								"Content-Type": "application/x-www-form-urlencoded",
								"Content-Length": String(postData.length)
							}
						})
					} else {
						const postData = JSON.stringify(data.jsonData)
						console.log(postData)
						if (postData == undefined) return None();
						else return Some({
							content: postData,
							headers: {
								"Content-Type": "application/json",
								"Content-Length": String(postData.length)
							}
						})
					}
				 } else return None();
			}())
	
			const options = {
				hostname: serverParams.host,
				port: serverParams.port,
				path: (serverParams.pathPrefix || "") + self.config.path,
				method: self.config.type,
				headers: <any>{
					...staticHeaders,
					...self.config.extraHeaders.getOrElse({}),
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
	
			const req = serverParams.makeRequest(options, reqCallback);
	
			req.on('error', (e: string) => {
				reject(e);
			});

			postValues.map(v => v.content).forEach(v => req.write(v))
	
			req.end();
		}).then(this.config.parseServerResponse, this.config.parseRequestFailure);
	}
}