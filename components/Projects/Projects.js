import {
    block,
    E,
    style,
    Component,
    RouteLink,
    css
} from '../../utils/index.js';
import {
    Button
} from '../../blocks/index.js';

import './Projects.less';

const b = block('projects');

const Projects = Component.Projects(() => {
    return () => {
        return E.div.class(b())(
            E.h2('Проекты'),
            RouteLink.href('projects/unicode')(
                Button(
                    E.div.style(style({padding: '16px 64px'}))(
                        'Юникод',
                        E.br,
                        E.span.style`font-size: 72px`('✍')
                    )
                )
            )
        );
    }
});

export default Projects;
