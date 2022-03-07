import { BookElements, BookLayoutView, LayoutProps } from '../model';

const defaultSize = 100;

const getNormalSize = (value: number) =>
    value <= 0 ? defaultSize : Math.floor(value);

export function parseSize(value: string | number = 1): number {
    if (typeof value === 'string') {
        if (value[value.length - 1] === '%') {
            const size = parseFloat(value);
            if (Number.isNaN(size)) {
                return defaultSize;
            }
            return getNormalSize(size);
        }
        return defaultSize;
    }
    return getNormalSize(value * defaultSize);
}

export function getCssSizeStyle(params: {
    width: number;
    height: number;
}): string {
    const { width, height } = params;
    return `max-height: ${height}vh; max-width: ${width}%`;
}

function getLayoutView(props: LayoutProps): BookLayoutView {
    if (props.inline) {
        return 'inline';
    }
    if (props.block) {
        return 'block';
    }
    return props.position === 'inline' ? 'inline' : 'block';
}

export function getLayoutParams(props: LayoutProps): {
    view: BookLayoutView;
    position: LayoutProps['position'];
} {
    return {
        view: getLayoutView(props),
        position: props.position ?? 'center',
    };
}
