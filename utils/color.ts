function* generateHue(angle: number = 97, n = 360): Generator<number> {
    let i = 0,
        hue = 0;
    const max = Math.min(n, 360);
    while (i < max) {
        const newHue = (hue + angle) % 360;
        yield hue;
        i++;
        hue = newHue;
    }
}

export const allColors = [...generateHue(97, 15)].map(
    (hue) => `hsl(${hue}, 50%, 60%)`
);
