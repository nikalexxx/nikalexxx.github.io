import './Tooltip.less';

import { Component, E, block, style } from '../../utils';

const b = block('tooltip');

const closeStore = new Map();
let k = 0;
let current = null;

function closeCurrent() {
    if (current !== null && closeStore.has(current)) {
        closeStore.get(current)();
        closeStore.delete(current);
    }
}

function onCloseTooltip(e) {
    if (e.target.closest(`div.${b('content')}`)) {
        return;
    }
    closeCurrent();
}
window.addEventListener('click', onCloseTooltip, false);

function onCloseTooltipByKey(e) {
    if (e.keyCode === 27) {
        closeCurrent();
    }
}

window.addEventListener('keyup', onCloseTooltipByKey, false);

function getAreaSizes({
    width: areaWidth,
    height: areaHeight,
    textStart,
    textEnd,
    contentWidth,
    contentHeight,
}) {
    const overflowX = contentWidth > areaWidth;
    const overflowY = contentHeight > areaHeight;
    const height = Math.min(contentHeight, areaHeight);
    const width = Math.min(contentWidth, areaWidth);
    const startWidth = areaWidth - textStart;
    const endWidth = textEnd;
    const subAreaWidth = Math.max(endWidth, startWidth);
    let position;
    if (contentWidth <= subAreaWidth) {
        position = startWidth > endWidth ? 'start' : 'end';
    } else {
        position = 'center';
    }
    let freeSpace;
    let secondFreeSpace;
    let overflow;
    let secondOverflow;
    if (contentWidth > contentHeight) {
        freeSpace = areaHeight - height;
        secondFreeSpace = areaWidth - width;
        overflow = overflowY;
        secondOverflow = overflowX;
    } else {
        freeSpace = areaWidth - width;
        secondFreeSpace = areaHeight - height;
        overflow = overflowX;
        secondOverflow = overflowY;
    }
    return {
        overflow,
        secondOverflow,
        height,
        width,
        position,
        freeSpace,
        secondFreeSpace,
    };
}

function getOptimizedSizes({
    contentWidth,
    contentHeight,
    textWidth,
    textHeight,
    textTop,
    textLeft,
    pageWidth,
    pageHeight,
}) {
    const areas = {
        top: {
            width: pageWidth,
            height: textTop,
            textStart: textLeft,
            textEnd: textLeft + textWidth,
            contentWidth: contentWidth,
            contentHeight: contentHeight,
            cssTop: ({ height }) => {
                return -height;
            },
            cssLeft: ({ position, textWidth, width, textStart }) => {
                return {
                    start: 0,
                    end: textWidth - width,
                    center: Math.floor(
                        (textWidth - width) / 2 +
                            (pageWidth / 2 - (textStart + textWidth / 2))
                    ),
                }[position];
            },
            cssWidth: ({ width }) => width,
            cssHeight: ({ height }) => height,
        },
        bottom: {
            width: pageWidth,
            height: pageHeight - textTop - textHeight,
            textStart: pageWidth - textLeft - textWidth,
            textEnd: pageWidth - textLeft,
            contentWidth: contentWidth,
            contentHeight: contentHeight,
            cssTop: ({ textHeight }) => {
                return textHeight;
            },
            cssLeft: ({ position, textWidth, width, textStart }) => {
                return {
                    start: textWidth - width,
                    end: 0,
                    center: Math.floor(
                        (textWidth - width) / 2 +
                            (textStart + textWidth / 2 - pageWidth / 2)
                    ),
                }[position];
            },
            cssWidth: ({ width }) => width,
            cssHeight: ({ height }) => height,
        },
        left: {
            width: pageHeight,
            height: textLeft,
            textStart: pageHeight - textTop - textHeight,
            textEnd: pageHeight - textTop,
            contentWidth: contentHeight,
            contentHeight: contentWidth,
            cssTop: ({ position, textHeight, width, textStart }) => {
                return {
                    start: textHeight - width,
                    end: 0,
                    // center: Math.floor((textHeight - width) / 2),
                    center: Math.floor(
                        (textHeight - width) / 2 +
                            (textStart + textHeight / 2 - pageHeight / 2)
                    ),
                }[position];
            },
            cssLeft: ({ height }) => {
                return -height;
            },
            cssWidth: ({ height }) => height,
            cssHeight: ({ width }) => width,
        },
        right: {
            width: pageHeight,
            height: pageWidth - textLeft - textWidth,
            textStart: textTop,
            textEnd: textTop + textHeight,
            contentWidth: contentHeight,
            contentHeight: contentWidth,
            cssTop: ({ position, textHeight, width, textStart }) => {
                return {
                    start: 0,
                    end: textHeight - width,
                    // center: Math.floor((textHeight - width) / 2),
                    center: Math.floor(
                        (textHeight - width) / 2 +
                            (pageHeight / 2 - (textStart + textHeight / 2))
                    ),
                }[position];
            },
            cssLeft: ({ textWidth }) => {
                return textWidth;
            },
            cssWidth: ({ height }) => height,
            cssHeight: ({ width }) => width,
        },
    };

    const areaList = [];
    for (const area of Object.keys(areas)) {
        const areaData = areas[area];
        const {
            position,
            overflow,
            secondOverflow,
            width: areaWidth,
            height: areaHeight,
            freeSpace,
            secondFreeSpace,
        } = getAreaSizes(areaData);
        const cssData = {
            ...areaData,
            width: areaWidth,
            height: areaHeight,
            position,
            textWidth,
            textHeight,
        };
        const top = areaData.cssTop(cssData);
        const left = areaData.cssLeft(cssData);
        const width = areaData.cssWidth(cssData);
        const height = areaData.cssHeight(cssData);

        areaList.push({
            area,
            position,
            overflow,
            secondOverflow,
            width,
            height,
            freeSpace,
            secondFreeSpace,
            top,
            left,
        });
    }

    // TODO: переделать за один проход
    const resultArea = areaList.sort((a, b) => {
        const overflowDiff = Number(!b.overflow) - Number(!a.overflow);
        if (overflowDiff !== 0) {
            return overflowDiff;
        }
        const secondOverflowDiff =
            Number(!b.secondOverflow) - Number(!a.secondOverflow);
        if (secondOverflowDiff !== 0) {
            return secondOverflowDiff;
        }
        const freeDiff = b.freeSpace - a.freeSpace;
        if (freeDiff !== 0) {
            return freeDiff;
        }
        return b.secondFreeSpace - a.secondFreeSpace;
    })[0];


    const { top, left, width, height } = resultArea;
    return { top, left, width, height };
}

export const Tooltip = Component.Tooltip(({ props, state }) => {
    const id = k++;

    state.init({
        visible: false,
        bottom: '-100%',
    });

    function closeTooltip() {
        state.set({ visible: false });
        current = null;
    }

    closeStore.set(id, closeTooltip);

    let textContent;
    let content;

    function onTextContentClick(e) {
        e.stopPropagation();
        const textSizes = textContent.getBoundingClientRect();
        const sizesData = {
            contentWidth: content.offsetWidth,
            contentHeight: content.offsetHeight,
            textWidth: textContent.offsetWidth,
            textHeight: textContent.offsetHeight,
            textTop: textSizes.top,
            textLeft: textSizes.left,
            pageWidth: window.innerWidth,
            pageHeight: window.innerHeight,
        };
        const { top, left, width, height } = getOptimizedSizes(sizesData);
        if (current !== id) {
            closeCurrent();
        }
        state.set((s) => ({
            visible: !s.visible,
            bottom: `-${content.clientHeight + 8}px`,
            top,
            left,
            width,
            height,
        }));
        current = id;
        if (!closeStore.has(id)) {
            closeStore.set(id, closeTooltip);
        }
    }

    return () => {
        const { text, children } = props();
        const { visible, top, left, width, height } = state();


        return E.div.class(b())(
            E.div
                .class(b('text', { current: visible }))
                ._ref((e) => (textContent = e))
                .onClick(onTextContentClick)(children),
            E.div
                .style(
                    visible &&
                        style({
                            top: `${top}px`,
                            left: `${left}px`,
                            width: `${width}px`,
                            height: `${height}px`,
                        })
                )
                .class(b('content', { visible }))
                ._ref((e) => (content = e))(text)
        );
    };
});
