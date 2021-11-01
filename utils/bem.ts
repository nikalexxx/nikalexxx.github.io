export const block = (blockName: string) => {
    const block = String(blockName);
    return function (
        element: string,
        modifiers: Record<string, string | boolean> = {},
        mixin?: string
    ) {
        const cssStack = [];
        const elementName = block + (element ? `__${element}` : '');
        cssStack.push(elementName);
        for (const mod in modifiers) {
            const value = modifiers[mod];
            if (typeof value === 'boolean') {
                if (value) {
                    cssStack.push(`${elementName}_${mod}`);
                }
            } else {
                cssStack.push(`${elementName}_${mod}_${value}`);
            }
        }
        return `${cssStack.join(' ')}${mixin ? ` ${mixin}` : ''}`;
    };
};

export default block;
