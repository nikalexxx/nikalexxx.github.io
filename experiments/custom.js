import {E, Component} from '../utils';

let count  = 0;
function getCustom(name, elements, didMount) {
    class CustomElement extends HTMLElement {
        constructor() {
            super();

            const shadow = this.attachShadow({mode: 'open'});
            shadow.append(E.slot.name('element-slot')())
        }

        connectedCallback() {
            didMount(elements)
        }
    }
    count++;
    const customName = `custom-${name}-${count}`;
    customElements.define(customName, CustomElement);
    return E[customName](
        E.div.slot('element-slot')(
            elements
        )
    );
}

export default Component.Custom(() => {
    return ({name, children, didMount}) => {
        return getCustom(name, children, didMount);
    }
});
