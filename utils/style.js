export default function (props = {}) {
    const cssProps = [];
    for (const prop in props) {
        const name = prop.replace(/[A-Z]/g, x => '-' + x.toLowerCase());
        cssProps.push(`${name}: ${props[prop]};`);
    }
    return cssProps.join(' ');
}
