import './Modal.less';

import { Component, E, block } from '../../utils';

import { DOM } from '../../utils/element';

const b = block('modal');


export const Modal = {
    open: (fn) => {
        const container = DOM(E.div.class(b('container')));

        const close = () => {
            document.body.removeChild(container);
        };

        const update = content => {
            container.lastElementChild.remove();
            container.appendChild(content);
        }

        const background = DOM(
            E.div.class(b('background')).onClick(() => close())
        );
        const content = DOM(E.div.class(b('content'))(fn(close)));

        container.appendChild(background);
        container.appendChild(content);

        document.body.appendChild(container);
    },
};
