/**
 * Схлопывает массивы элементов
 */
export function getFlatNode<T>(node: T | T[]): T[] {
    if (Array.isArray(node)) {
        return node.flatMap(getFlatNode);
    }
    return [node];
}
