import {E} from './element.js';
export default function(path) {
    const type = path.split('.').slice(-1)[0];
    return new Promise(resolve => {
        const link = E.link
            .rel(`stylesheet${type === 'less' ? '/less' : ''}`)
            .type('text/css')
            .href(path)();
        if (type === 'less') {
            const less = E.script.src('less.js')();
            if (!document.head.querySelector('script[src="less.js')) {
                document.head.append(less);
            }
            document.head.append(link);
            function update() {
                const style = document.head.querySelector(`style[id$=${path.split('.')[0].replace(/\//g, '-')}]`);
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
