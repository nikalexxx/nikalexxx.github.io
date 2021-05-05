import './Gallery.less';

import { Component, E, block } from '../../utils';

import { ImageViewer } from '../ImageViewer/ImageViewer';
import { Modal } from '../../blocks';
import imgConfig from '../../services/images/config.json';

const b = block('gallery');

function checkWebpSupport(callback) {
    const webpImg = new Image();

    const check = () => callback(webpImg.height === 2);
    webpImg.onload = check;
    webpImg.onerror = check;

    webpImg.src =
        'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
}

// маскимальное соотношение большей стороны к меньшей, чтобы избежать очень узких и длинных блоков
const MAX_RATIO = 10;

// минимальный размер меньшей стороны, чтобы не целиться мышкой
const MIN_SIZE = 40;

const { longSize, shortSize } = imgConfig;

// TODO: сделать строки изображений
function getSmallSizes({ width, height }) {
    const isVertical = height > width;
    const short = isVertical ? width : height;
    const long = isVertical ? height : width;

    const ratio = long / short;
    const targetRatio = Math.min(ratio, MAX_RATIO);

    const scale = Math.max(1, short / shortSize);

    const scaleShort = short / scale;
    const targetShort = Math.min(longSize, Math.max(MIN_SIZE, scaleShort));

    const scaleLong = targetShort * targetRatio;
    const targetLong = Math.min(longSize, Math.max(MIN_SIZE, scaleLong));
    return {
        width: isVertical ? targetShort : targetLong,
        height: isVertical ? targetLong : targetShort,
    };
}

export const Gallery = Component.Gallery(({ props, state, hooks }) => {
    let container;

    state.init({ containerWidth: 0, webp: false });

    hooks.didMount(() => {
        checkWebpSupport((webp) => state.set({ webp }));

        if (container) {
            const width = container.clientWidth;
            if (width !== state().containerWidth) {
                state.set({ containerWidth: width });
            }
        }
    });

    return () => {
        const { imgList, imgPath } = props();
        const smallPath = `${imgPath}/small`;
        const { webp } = state();

        const format = webp ? 'webp' : 'jpg';

        return E.div._ref((e) => (container = e)).class(b())(
            imgList.map((image) => {
                const { name, width, height, extension } = image;
                const isVertical = height > width;
                const short = isVertical ? width : height;
                const long = isVertical ? height : width;

                const ratio = long / short;

                return E.div
                    .class(b('tile'))
                    .onClick(() =>
                        Modal.open((close) =>
                            ImageViewer.path(
                                `${imgPath}/original/${name}.${extension}`
                            )
                                .width(width)
                                .height(height)
                                .close(close)
                        )
                    )
                    .style(
                        `background-image: url(${smallPath}/${name}.${format})`
                    )();
            })
        );
    };
});
