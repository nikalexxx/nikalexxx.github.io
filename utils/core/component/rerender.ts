export function getComponentChildNodes(
    parentNode: Node,
    start: Node,
    end: Node
): Record<string, Node> {
    let upd = true;
    let current: Node | null = start;
    let currentIndex = Array.from(parentNode.childNodes).indexOf(
        start as ChildNode
    );
    const oldChildren: Record<string, Node> = {};
    while (upd && current) {
        // сохранение
        const key = current[elementSymbol]?.props?._key ?? `${currentIndex}`;
        oldChildren[key] = current;

        // следующий шаг
        if (current === end) {
            upd = false;
        }
        current = current.nextSibling;
        currentIndex++;
    }

    return oldChildren;
}
