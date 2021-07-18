import './HighlightingText.less';

// @ts-nocheck
import { Component, E, block } from '../../utils';
import {
    FlatLines,
    FlatText,
    RichLines,
    RichText,
} from '../../services/syntaxHighlighter/model';

import { tokenize } from '../../services/syntaxHighlighter';

const b = block('highlighting-text');

function getClass(type: string): string {
    if (!type) {
        return 'unknown';
    }
    const levels = type.split('.');
    if (levels[0] === 'keyword') {
        if (levels[1] === 'operator') {
            return 'operator';
        }
        return 'keyword';
    } else if (levels[0] === 'variable') {
        return 'variable';
    } else if (levels[0] === 'string') {
        return 'string';
    } else if (levels[0] === 'constant') {
        return 'constant';
    } else if (levels[0] === 'support') {
        if (levels[1] === 'class') {
            return 'class';
        }
        return 'variable';
    }
    return type;
}

function getLineItem(item: FlatText) {
    const [text, groups] = item;

    const classNames = (groups ?? []).reduce((names, group) => {
        names[group[0]] = true;
        return names;
    }, {} as Record<string, true>);

    return E.span.class(b('t', classNames))(text);
}

function getContent(flatLines: FlatLines) {
    return flatLines.map((line, i) => [
        E.div.class(b('number'))(i + 1),
        E.code.class(b('line'))(line.map((item) => getLineItem(item))),
    ]);
}

const cache: Record<string, Map<string, RichLines>> = {};

export const HighlightingText = Component.HighlightingText(
    ({ props, state, hooks }) => {
        state.init({
            content: getContent(
                props()
                    .text.split('\n')
                    .map((e) => [[e, null]])
            ),
        });

        const { text, lang } = props();

        hooks.didMount(() => {
            if (cache.hasOwnProperty(lang) && cache[lang].has(text)) {
                state.set({ content: cache[lang].get(text) });
            } else {
                tokenize(text, lang).then((richLines) => {
                    const content = getContent(richLines);
                    if (!cache.hasOwnProperty(lang)) {
                        cache[lang] = new Map();
                    }
                    cache[lang].set(text, content);
                    state.set({ content });
                });
            }
        });

        return () => {
            const { content } = state();
            return E.pre.class(b())(content);
        };
    }
);
