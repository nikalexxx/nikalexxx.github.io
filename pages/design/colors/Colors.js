import './Colors.less';

import {
    Component,
    E,
    block,
    css,
    style
} from '../../../utils';

import { Breadcrumbs } from '../../../components';
import { Lang } from '../../../blocks';

const colors = [
    'black',
    'dark-black',
    'dark',
    'dark-gray',
    'gray-dark',
    'gray',
    'gray-light-medium',
    'gray-light',
    'light-gray-medium',
    'light-gray',
    'light',
    'light-white',
    'white',
    'blue',
    'blue-light',
    'blue-dark',
    'blue-sky',
    'cyan',
    'red',
    'red-light',
    'green-light',
    'orange-light',
    'yellow-light',
    'violet-light',
];

const b = block('colors');

let currentListener;

const Colors = Component.Colors(({state, hooks}) => {
    function getContrastCondition(rgb) {
        if (document.body.classList.contains('theme_light')) {
            const v = Math.min(...rgb);
            return v > 230;
        } else {
            const v = Math.max(...rgb);
            return v > 38 && v < 78;
        }
    }

    state.init({theme: ''});

    hooks.didMount(() => {
        if (currentListener) {
            window.removeEventListener('theme', currentListener);
            currentListener = null;
        }
        currentListener = window.addEventListener('theme', e => {
            state.set({theme: e.detail.theme});
        });
    });

    return () => E.div(
        Breadcrumbs.items([[Lang.token`menu/design`, 'design'], [Lang.token`tile/colors`]]),
        E.div.class(b())(
            colors.map(color => {
                const code = getComputedStyle(document.documentElement).getPropertyValue(`--color-${color}`).trim();
                const rgb = (s => [s.slice(0,2), s.slice(2,4),s.slice(4)].map(hex => parseInt(hex, 16)))(code.slice(1))
                const v = Math.max(...rgb);
                const contrast = v > 162 ? 'black' : 'white';
                const border = getContrastCondition(rgb) ? 'solid 1px var(--color-border-contrast)' : undefined;
                const colorNode = E.div(
                    E.div
                        .class(b('area', {color}))
                        .style(style({
                            ...(border ? {border} : {}),
                            color: contrast,
                            backgroundColor: `var(--color-${color})`
                        }))
                    (
                        E.div.class(b('code'))(code)
                    ),
                    E.div.class(b('name'))(color)
                );
                return colorNode;
            })
        )
    );
});


export default Colors;
