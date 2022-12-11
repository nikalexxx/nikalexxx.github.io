import './YoutubeVideo.less';

import { Component, E, block } from '../../utils';

const b = block('youtube-video');

export const YoutubeVideo = Component.YoutubeVideo(({ props }) => {
    return () => {
        const { id } = props();
        return E.iframe.class(b()).width`560`.height`315`.src(`https://www.youtube.com/embed/${id}`)
            .title`YouTube video player`.frameborder`0`
            .allow`encrypted-media; picture-in-picture`.allowfullscreen(true);
    };
});
