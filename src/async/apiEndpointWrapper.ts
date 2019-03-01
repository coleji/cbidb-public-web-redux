import { ApiEndpointCacheStatus, UNINITIALIZED } from "./apiEndpointCacheStatus";

export default abstract class ApiEndpointWrapper<T> {
	path: String
	status: ApiEndpointCacheStatus<T>
	constructor(path: String) {
		this.path = path;
		this.status = UNINITIALIZED;
	}
	protected update(status: ApiEndpointCacheStatus<T>): void {
		this.status = status;
	}
	abstract pull(): void
}