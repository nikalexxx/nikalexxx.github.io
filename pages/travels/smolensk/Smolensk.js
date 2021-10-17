import { Breadcrumbs, Gallery } from '../../../components';
import { Component, E } from '../../../utils';

import { imgList } from '../../../data/images/travels/smolensk/list';
import { Lang } from '../../../blocks';

export const Smolensk = Component.Smolensk(() => {
    return () =>
        E.div(
            Breadcrumbs.items([[Lang.token`menu/travels`, 'travels'], ['Смоленск']]),
            E.div.style`padding: 15px;`(
                E.p(`
                Смоленск, 2 октября 2021 года.
                `),
                E.br,
                E.p
                    .style`color: var(--color-text-secondary); font-size: 0.8em; font-style: italic;`(
                    'Все приведённые изображения являются моей собственностью и распространяются по лизензии ',
                    E.a.href(
                        'https://creativecommons.org/licenses/by-sa/4.0/deed.ru'
                    )(
                        'Creative Commons Attribution-ShareAlike 4.0 International Public License'
                    )
                ),
                E.br,
                Gallery.imgList(imgList).imgPath('./data/images/travels/smolensk')
            )
        );
});
