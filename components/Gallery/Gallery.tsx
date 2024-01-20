import "./Gallery.less";

import { block } from "../../utils";

import { ImageViewer } from "../ImageViewer/ImageViewer";
import { Modal } from "../../blocks";
import imgConfig from "../../services/images/config.json";
import { Component } from "parvis";

const b = block("gallery");

function checkWebpSupport(callback: (result: boolean) => void) {
    const webpImg = new Image();

    const check = () => callback(webpImg.height === 2);
    webpImg.onload = check;
    webpImg.onerror = check;

    webpImg.src =
        "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

// маскимальное соотношение большей стороны к меньшей, чтобы избежать очень узких и длинных блоков
const MAX_RATIO = 10;

// минимальный размер меньшей стороны, чтобы не целиться мышкой
const MIN_SIZE = 40;

const { longSize, shortSize } = imgConfig;

// TODO: сделать строки изображений
function getSmallSizes({ width, height }: {width: number; height: number}) {
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

type ImgData = {
    name: string;
    extension: string;
    width: number;
    height: number;
};
type Props = {
    imgPath: string;
    imgList: ImgData[];
};

export const Gallery = Component<Props>(
    "Gallery",
    ({ props, state, hooks }) => {
        let container: HTMLDivElement;

        const [isWebpSupport, setWebpSupport] = state(false);
        const [containerWidth, setContainerWidth] = state(0);
        const [getI, setI] = state(null as number | null);

        hooks.mount(() => {
            checkWebpSupport(setWebpSupport);

            if (container) {
                const width = container.clientWidth;
                if (width !== containerWidth()) {
                    setContainerWidth(width);
                }
            }
        });

        let currentClose = () => {};
        return () => {
            const { imgList, imgPath } = props();
            const smallPath = `${imgPath}/small`;

            const format = isWebpSupport() ? "webp" : "jpg";
            const i = getI();

            if (i !== null) {
                const { name, extension, width, height } = imgList[i];
                try {
                    currentClose();
                } catch (e) {
                    currentClose = () => {};
                }
                Modal.open((close) => {
                    currentClose = close;
                    // console.log({i});
                    return (
                        <ImageViewer
                            path={`${imgPath}/original/${name}.${extension}`}
                            width={width}
                            height={height}
                            close={close}
                            toRight={
                                i === imgList.length - 1
                                    ? () => {}
                                    : () => setI(i + 1)
                            }
                            toLeft={i === 0 ? () => {} : () => setI(i - 1)}
                        />
                    );
                });
            }

            return (
                <div _ref={(e) => (container = e)} class={b()}>
                    {imgList.map((image, index) => {
                        const { name, width, height, extension } = image;
                        const isVertical = height > width;
                        const short = isVertical ? width : height;
                        const long = isVertical ? height : width;

                        const ratio = long / short;

                        return (
                            <div
                                class={b("tile")}
                                on:click={() => setI(index)}
                                style={`background-image: url(${smallPath}/${name}.${format})`}
                            ></div>
                        );
                    })}
                </div>
            );
        };
    }
);
