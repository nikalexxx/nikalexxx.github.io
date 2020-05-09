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
            E.div.class(b('list'))(
                RouteLink.href('projects/unicode')(
                    Button.class(b('button'))(
                        E.div.class(b('tile'))(
                            'Юникод',
                            E.span.style`font-size: 4em`('✍')
                        )
                    )
                ),
                RouteLink.href('projects/game-of-life')(
                    Button.class(b('button'))(
                        E.div.class(b('tile'))(
                            'Игра «Жизнь»',
                            E.div.class(b('glider'))(
                                E.div,
                                E.div.class(b('fill')),
                                E.div,
                                E.div,
                                E.div,
                                E.div.class(b('fill')),
                                E.div.class(b('fill')),
                                E.div.class(b('fill')),
                                E.div.class(b('fill'))
                            )
                        )
                    )
                )
            )
        );
    }
});

export default Projects;
