import './Reports.less';

import { Component, E, block, RouteLink } from '../../utils';
import { PageGrid, YoutubeVideo } from '../../components';
import { Lang } from '../../blocks';

const b = block('reports');

export const Reports = Component.Reports(() => {
    return () => {
        return E.div.class(b())(
            E.h2(Lang.token`menu/reports`),
            E.p('Видео доклады перемещены в раздел ', RouteLink.href('video')`Видео`)
        );
    };
});
