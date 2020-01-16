import {elementSymbol, componentSymbol} from './symbols.js';
import {E} from './element.js';

export const getClone = element => {
    // console.log('clone', element);
    if (!element.cloneNode) {
        throw new Error('clone не удался')
        return element;
    }
    // console.log({element});
    if (element.nodeType === 3) {
        return element.cloneNode(false);
    }
    let clone = E[element.tagName.toLowerCase()];
    if (elementSymbol in element) {
        clone = clone[Symbol('props')](element[elementSymbol].props)();
        // clone[elementSymbol] = element[elementSymbol];
    } else {
        clone = clone();
    }
    if (componentSymbol in element) {
        clone[componentSymbol] = element[componentSymbol];
        clone[componentSymbol].element = clone;
        // element[componentSymbol].element = clone;
    }
    if (element[elementSymbol] && Object.keys(element[elementSymbol].eventListeners).length > 0) {
        for (const eventName of Object.keys(element[elementSymbol].eventListeners)) {
            const listeners = element[elementSymbol].eventListeners[eventName];
            for (const listener of listeners) {
                clone.addEventListener(eventName, listener, false);
            }
        }
    }
    for (const child of Array.from(element.childNodes)) {
        const cloneChild = getClone(child);
        clone.append(cloneChild);
    }
    return clone;
}
