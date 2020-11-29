import './Projects.less';

import { Component, E, RouteLink, block } from '../../utils';
import { PageGrid, Tile } from '../../components';

import { Button } from '../../blocks';

const b = block('projects');

const Projects = Component.Projects(() => {
    return () => {
        return E.div.class(b())(
            E.h2('Проекты'),
            PageGrid(
                RouteLink.href('projects/unicode')(
                    Tile(
                        E.div.class(b('tile'))(
                            'Юникод',
                            E.span.style`font-size: 4em`('✍')
                        )
                    )
                ),
                RouteLink.href('projects/game-of-life')(
                    Tile(
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
    };
});

export default Projects;
