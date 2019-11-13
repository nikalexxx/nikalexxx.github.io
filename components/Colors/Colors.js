import {
    block,
    E,
    cssImport,
    style,
    Component
} from '../../utils/index.js';

cssImport('components/Colors/Colors.less');

const colors = [
    'area',
    'menu',
    'menu-active',
    'menu-hover',
    'menu-folder',
    'element-active',
    'string-number',
    'syntax-variable',
    'syntax-number',
    'syntax-operator',
    'syntax-gray',
    'syntax-dark-gray',
    'syntax-keyword',
    'syntax-class',
    'syntax-function',
    'syntax-string',
    'syntax-inline',
    'input-text',
    'input-area',
    'md-link',
    'atom-link',
    'atom-button',
    'atom-button-hover',
    'atom-black-line'
];

const b = block('colors');

const Colors = Component.Colors(({didMount}) => {
    const colorsRootElement = E.div.class(b())(
        colors.map(color =>
            E.div(
                E.div.class(b('area', {color}))(
                    E.div.class(b('name'))
                ),
                E.div(color)
            )
        )
    );

    didMount((props, state) => {
        // console.log({didMountData: {props, state}, colorsRootElement});
        window.setTimeout(() => renderColors(colorsRootElement), 100);
    });

    return () => {
        return colorsRootElement;
    }
});

function renderColors(colorsRootElement) {
    const colorNodes = colorsRootElement.children;
    // console.log(colorNodes);
    for (const colorNode of (colorNodes)) {
        const areaNode = colorNode.children[0];
        const css = window.getComputedStyle(areaNode);
        const color = css.backgroundColor;
        const rgb = ((color.split('(')[1] || '').split(')')[0] || '').split(',').map(e => Number(e.trim()));
        const code = '#' + rgb.map(x => x.toString(16)).join('');
        const v = Math.max(...rgb);
        const contrast = v > 162 ? 'black' : 'white';
        const border = v > 38 && v < 78 ? 'solid 1px #abb2de' : '';
        const nameNode = areaNode.children[0];
        areaNode.style.border = border;
        nameNode.style.color = contrast;
        nameNode.innerHTML = code;
    }
}

export default Colors;
