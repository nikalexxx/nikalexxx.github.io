export function getCounter() {
    let i = 0;
    const free: number[] = [];
    return {
        get() {
            return free.length > 0 ? free.pop()! : i++;
        },
        remove(j: number) {
            free.push(j);
        }
    };
}
