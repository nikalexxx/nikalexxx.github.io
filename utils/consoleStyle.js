export const css = new Proxy({}, {
    get: (target, name) => text => [`%c${text}%c`, name, '']
});

export const color = new Proxy({}, {
    get: (target, name) => text => css[`color:${name}`](text)
});


export function consoleStyle(textList, ...args) {
    const styles = [];
    const text = [];
    for (let i = 0; i < textList.length - 1; i++) {
        const s = textList[i];
        const v = args[i][0];
        text.push(s, v);
        const local = args[i][1];
        styles.push(...(Array.isArray(local) ? local : [local, args[i][2]]));
    }
    text.push(textList[textList.length - 1]);
    return [text.join(''), styles];
}

export const mix = new Proxy({}, {
    get: (target, name) => styles => styles.map(e => `${e};${name}`)
});

const background = color => e => mix[`background-color:${color}`](e);


const _key = text => color['#a53bbb'](text);
const _func = text => color['#35a0ed'](text);
const _var = text => color['#de4d57'](text);
const _const = text => color['#e0994a'](text);
const _op = text => color['#4ba6b1'](text);
const S = {
    key: _key,
    func: _func
}

const [text, styles] = consoleStyle`
${S.key`export`} ${S.key`function`} ${S.func`consoleStyle`}(${_var('textList')}, ...${_var('args')}) {
    ${_key('const')} ${_var('styles')} ${_op('=')} [];
    ${_key('const')} ${_var('text')} ${_op('=')} [];
    ${_key('for')} (${_key('let')} ${_var('i')} ${_op('=')} ${_const('0')}; ${_var('i')} ${_op('<')} ${_var('textList')}.${_var('length')} ${_op('-')} ${_const('1')}; ${_var('i')}${_op('++')}) {
        ${_key('const')} ${_var('s')} ${_op('=')} ${_var('textList')}[${_var('i')}];
        ${_key('const')} ${_var('v')} ${_op('=')} ${_var('args')}[${_var('i')}][${_const('0')}];
        ${_var('text')}.${_op('push')}(${_var('s')}, ${_var('v')});
        ${_var('styles')}.${_op('push')}(${_var('args')}[${_var('i')}][${_const('1')}], ${_var('args')}[${_var('i')}][${_const('2')}]);
    }
    ${_var('text')}.${_op('push')}(${_var('textList')}[${_var('textList')}.${_var('length')} ${_op('-')} ${_const('1')}]);
    ${_key('return')} [${_var('text')}.${_op('join')}(${_var(`''`)}), ${_var('styles')}];
}
`;
// console.log(text, ...styles);

export const _b = text => css['font-weight: bold'](text);
export const _i = text => css['font-style: italic'](text);
export const _pre = text => css['font-family: monospace'](text);
export const _h = l => text => css[`font-size: ${21 - l}px`](text);

const [text1, styles1] = consoleStyle`${_h(1)('Документация')}
see http://127.0.0.1:5500/?/blog/1
${_b('bold')} and ${_i('italic')} and ${_pre('pre')}
`;
// console.log(text1, ...styles1);

