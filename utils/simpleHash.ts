export function hash(str: string) {
    let i;
    let l = str.length;
    let hval = 0x811c9dc5;

    for (i = 0; i < l; i++) {
        hval ^= str.charCodeAt(i);
        hval +=
            (hval << 1) +
            (hval << 4) +
            (hval << 7) +
            (hval << 8) +
            (hval << 24);
    }
    return ('0000000' + (hval >>> 0).toString(16)).substr(-8);
}
