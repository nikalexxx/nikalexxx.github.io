import './Modal.less';

import { block } from '../../utils';

import { TemplateTree } from 'parvis/dist/model';
import { render } from 'parvis';

const b = block('modal');

export const Modal = {
    open: (fn: (closeFn: () => void) => TemplateTree) => {
        let el: HTMLDivElement;
        const close = () => {
            document.body.removeChild(el);
        };

        const container = <div _ref={e => el = e} class={(b('container'))}>
            <div class={(b('background'))} on:click={(() => close())} />
            <div class={(b('content'))}>{fn(close)}</div>
        </div>;

        render(document.body, container);
    },
};

