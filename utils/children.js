export const getChildren = children => {
    const nodes = [];
    for (const node of children) {
        if (Array.isArray(node)) {
            nodes.push(...node);
        } else if ((typeof node) === 'function') {
            nodes.push(node());
        } else {
            nodes.push(node);
        }
    }
    return nodes;
}
