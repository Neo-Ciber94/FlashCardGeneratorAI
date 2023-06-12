
/**
 * Returns a `Promise<T>` that can be resolved or rejected manually.
 */
export function deferred<T>() {
    let resolve = (value: T | PromiseLike<T>) => { };
    let reject = (reason?: any) => { };

    const promise = new Promise<T>((resolveCallback, rejectCallback) => {
        resolve = resolveCallback;
        reject = rejectCallback;
    });

    return {
        promise,
        resolve,
        reject
    }
}