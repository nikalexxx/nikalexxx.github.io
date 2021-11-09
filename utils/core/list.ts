import { Container, Content } from './vdom-model';

/**
 * Схлопывает массивы элементов
 */
export function getFlatNode(node: Container): Content[] {
    if (Array.isArray(node)) {
        return node.flatMap(getFlatNode);
    }
    return [node];
}
