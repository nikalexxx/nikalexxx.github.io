import { componentSymbol } from './component/symbols';
import { elementSymbol } from './symbols';
import { VDOMElement } from './vdom-model';

declare global {
    export interface Node {
        [elementSymbol]?: VDOMElement;
        [componentSymbol]?: {
            components: Map<string, {start: Node, end: Node}>;
        }
    }

    export interface WindowEventMap {
        didMount: CustomEvent;
    }

    export interface Window {
        vdom(e: Node | undefined | null): VDOMElement | undefined;

        appVersion: string;
    }
}
