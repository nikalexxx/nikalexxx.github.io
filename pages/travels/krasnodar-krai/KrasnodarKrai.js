import { Breadcrumbs, Gallery } from '../../../components';
import { Component, E } from '../../../utils';

import { imgList } from '../../../data/images/travels/krasnodar-krai/list';
import { Lang } from '../../../blocks';

export const KrasnodarKrai = Component.KrasnodarKrai(() => {
    return () =>
        E.div(
            Breadcrumbs.items([[Lang.token`menu/travels`, 'travels'], ['Краснодарский край']]),
            E.div.style`padding: 15px;`(
                E.p(`
                Краснодарский край, 7-23 августа 2021 года.
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
                Gallery.imgList(imgList).imgPath('./data/images/travels/krasnodar-krai')
            )
        );
});
