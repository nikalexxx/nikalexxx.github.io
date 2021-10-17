import './ImageViewer.less';

import { Component, E, block } from '../../utils';

import { Icon } from '../../icons';
import { Spin } from '../../blocks';

const b = block('image-viewer');

const closeIcon = Icon.Times.width`20px`.height`20px`;
const moveIcon = Icon.Play.width`20px`.height`20px`;

let controlListener = null;

export const ImageViewer = Component.ImageViewer(({ props, state }) => {
    state.init({ loading: true });

    if (controlListener) {
        window.removeEventListener('keyup', controlListener);
        controlListener = null;
    }

    controlListener = (e) => {
        const { toLeft, toRight, close } = props();
        if (toRight && e.code === 'ArrowRight') {
            toRight();
        }
        if (toLeft && e.code === 'ArrowLeft') {
            toLeft();
        }
        if (e.code === 'Escape') {
            close();
        }
    };
    window.addEventListener('keyup', controlListener);

    return () => {
        const { path, height, width, close, toRight, toLeft } = props();
        const { loading } = state();

        const isVertical = height > width;
        const short = isVertical ? width : height;
        const long = isVertical ? height : width;

        const ratio = long / short;

        const imgStyle = `${isVertical ? 'height' : 'width'}: 100v${
            isVertical ? 'h' : 'w'
        }; ${isVertical ? 'width' : 'height'}: ${100 / ratio}v${
            isVertical ? 'h' : 'w'
        }`;

        const moveMap = new Map([
            ['left', toLeft && (() => toLeft())],
            ['right', toRight && (() => toRight())],
        ]);

        return E.div
            .class(b('image'))
            .onClick(() => {
                close();
            })
            .style(imgStyle)(
            loading && E.div.class(b('loading'))(Spin.size`xl`),
            E.img
                .src(path)
                .alt(path)
                .style(`${!isVertical ? 'height' : 'width'}: 100%`)
                .onClick((e) => e.stopPropagation())
                .onLoad(() => state.set({ loading: false })),
            E.div.class(`${b('control')} ${b('close')}`)(closeIcon),
            E.div(
                Array.from(moveMap.entries()).map(([name, action]) =>
                    action
                        ? E.div
                              .onClick((e) => {
                                  //   e.preventDefault();
                                  e.stopPropagation();
                                  action();
                              })
                              .class(`${b('control')} ${b(name)}`)(moveIcon)
                        : E.div()
                )
            )
        );
    };
});
