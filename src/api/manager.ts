var registeredCaches: any = {};

export default function register(cacheName: string): any {
    console.log("registering " + cacheName);
    registeredCaches[cacheName] = true;
    return {
        dispatchWrapper: null,
        waiting: null,
        success: null,
        failed: null
    }
}