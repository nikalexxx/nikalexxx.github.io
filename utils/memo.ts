export function memo<A extends string | number, R>(fn: (...args: A[]) => R): (arg: A) => R {
    const cache: Map<string, R> = new Map();
    return (...args: A[]) => {
        const key = args.join();
        if (cache.has(key)) {
            return cache.get(key);
        }

        const res = fn(...args);
        cache.set(key, res)
        return res;
    }
}
