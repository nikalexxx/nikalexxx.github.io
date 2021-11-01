export function style(props: Record<string, string> = {}) {
    const cssProps = [];
    for (const prop in props) {
        const name = prop.replace(/[A-Z]/g, (x) => '-' + x.toLowerCase());
        cssProps.push(`${name}: ${props[prop]};`);
    }
    return cssProps.join(' ');
}
