import './ImageViewer.less';

import { Component, E, block } from '../../utils';

import { Icon } from '../../icons';

const b = block('image-viewer');

export const ImageViewer = Component.ImageViewer(({ props }) => {
    return () => {
        const { path, height, width, close } = props();

        const isVertical = height > width;
        const short = isVertical ? width : height;
        const long = isVertical ? height : width;

        const ratio = long / short;

        return E.div
            .class(b('image'))
            .onClick(() => {
                close();
            })
            .style(
                `${isVertical ? 'height' : 'width'}: 100v${
                    isVertical ? 'h' : 'w'
                }; ${isVertical ? 'width' : 'height'}: ${100 / ratio}v${
                    isVertical ? 'h' : 'w'
                }`
            )(
            E.img
                .src(path)
                .alt(path)
                .style(`${!isVertical ? 'height' : 'width'}: 100%`)
                .onClick((e) => e.stopPropagation()),
            E.div.class(b('close'))(Icon.Times.width`20px`.height`20px`)
        );
    };
});
