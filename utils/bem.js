const block = blockName => {
    const block = String(blockName);
    return function(element, modifiers, mixin) {
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
        return cssStack.join(' ');
    };
}

export default block;
