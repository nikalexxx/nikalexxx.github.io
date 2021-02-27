export function promiseLike<T>(data: T): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 0);
    });
}
