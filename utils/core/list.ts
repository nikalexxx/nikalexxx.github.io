import { Container, Content, RawContainer, RawContent } from './vdom-model';

/**
 * Схлопывает массивы элементов
 */
export function getFlatNode<C extends [Container, Content] | [RawContainer, RawContent]>(node: C[0]): C[1][] {
    if (Array.isArray(node)) {
        return node.flatMap(getFlatNode);
    }
    return [node] as C[1][];
}
