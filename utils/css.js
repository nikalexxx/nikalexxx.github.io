import {E, DOM} from './element.js';
const getDirPath = fileUrl => (new URL(fileUrl)).pathname.split('/').slice(0, -1).join('/');
export default function(sourceUrl, relativePath) {
    const type = relativePath.split('.').slice(-1)[0];
    if (!['css', 'less'].includes(type)) {
        throw new Error(`Import file type is ${type}, but 'css' or 'less' types are available only.`);
    }
    const pathRelative = /^\.\.?\//.test(relativePath);
    const sourcePath = getDirPath(sourceUrl).split('/').slice(1).join('/');
    const fullPath = sourcePath + (pathRelative ? relativePath.replace(/^\.\.?/, '') : '/' + relativePath);

    return new Promise(resolve => {
        const link = DOM(E.link
            .rel(`stylesheet${type === 'less' ? '/less' : ''}`)
            .type('text/css')
            .href(fullPath)());
        if (type === 'less') {
            if (!document.head.querySelector('script[src="less.js"]')) {
                const less = E.script.src('less.js')();
                document.head.append(DOM(less));
            }
            document.head.append(link);
            function update() {
                const style = document.head.querySelector(`style[id$="${fullPath.split('.')[0].replace(/\//g, '-')}"]`);
                // console.log(1);
                if (style) {
                    window.setTimeout(resolve, 100);
                } else {
                    window.setTimeout(update, 10);
                }
            }
            update();
        } else {
            document.head.append(link);
            link.addEventListener('load', () => resolve());
        }
    });
}
