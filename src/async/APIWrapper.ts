import * as t from 'io-ts'
import * as http from 'http';
import {FailureType, FailureType_BadReturn, FailureType_Unauthorized} from "./FailureType";
import { Either } from 'fp-ts/lib/Either';

export enum HttpMethod {
	GET = "GET",
	POST = "POST"
}

interface Success<T_Result> {
	type: "Success",
	result: T_Result
}

interface Failure {
	type: "Failure",
	failureType: FailureType
	err: string
}

type ApiResult<T_Result> = Success<T_Result> | Failure

interface ConfigCommon<T_Validator extends t.Any> {
	type: string & HttpMethod,
	path: string,
	extraHeaders?: Optional<object>,
	resultValidator: T_Validator
}

export interface GetConfig<T_Validator extends t.Any> extends ConfigCommon<T_Validator> {
	type: HttpMethod.GET,
}

export interface PostConfig<T_Validator extends t.Any> extends ConfigCommon<T_Validator> {
	type: HttpMethod.POST
}

export type Config<T_Validator extends t.Any> = GetConfig<T_Validator> | PostConfig<T_Validator>;

export interface ServerParams {
	host: string,
	makeRequest: typeof http.request,
	port: number,
	pathPrefix?: string,
	staticHeaders?: object
}

export interface PostString {
	type: "urlEncoded",
	urlEncodedData: string
}

export const PostString: (urlEncodedData: string) => PostString = urlEncodedData => ({type: "urlEncoded", urlEncodedData})

export interface PostJSON<T_PostJSON> {
	type: "json",
	jsonData: T_PostJSON
}

export type PostType<T> = PostString | PostJSON<T>

export default class APIWrapper<T_Validator extends t.Any, T_PostJSON> {
	config: Config<T_Validator>
	constructor(config: Config<T_Validator>) {
		this.config = config;
	}
	parseResponse: (response: string) => ApiResult<t.TypeOf<T_Validator>> = response => {
		type Result = t.TypeOf<T_Validator>;

		let parsed;
		try {
			parsed = JSON.parse(response)
		} catch (e) {
			return {type: "Failure", failureType: {type: "NotJSON"}, err: response};
		}
		
		if (parsed["error"]) return {type: "Failure", failureType: {type: "Unknown"}, err: response}

		const decoded: Either<t.Errors, Result> = this.config.resultValidator.decode(parsed)
		if (decoded.isRight()) return {type: "Success", result: decoded.getOrElse(null)}
		else return {type: "Failure", failureType: {type: "BadReturn"}, err: decoded.swap().getOrElse(null).toString()}
	}
	send: (serverParams: ServerParams) => (data: PostType<T_PostJSON>) => Promise<string> = serverParams => data => this.sendWithHeaders(serverParams, {})(data)
	sendWithHeaders: (serverParams: ServerParams, extraHeaders: object) => (data: PostType<T_PostJSON>) => Promise<string>
	= serverParams =>  data => {
		const self = this;
		return new Promise<string>((resolve, reject) => {
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
				//	...staticHeaders,
					...(self.config.extraHeaders || None()).getOrElse({}),
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
		}) // .then(this.config.parseServerResponse, this.config.parseRequestFailure);
	}
}