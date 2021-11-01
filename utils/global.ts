import { elementSymbol } from './symbols';
import { VDOMElement } from './vdom-model';

declare global {
    export interface Node {
        [elementSymbol]?: VDOMElement;
    }

    export interface WindowEventMap {
        didMount: CustomEvent;
    }
}
