const props = Symbol('props');
const marker = Symbol('marker');
const api = {
    meta: {
        title: () => String,
        authors: () => Array,
    },
    control: {
        start: marker,
        end: marker,
    },
    text: {
        [props]: {
            key: [String, Symbol],
        },
        a: () => ({
            href: String,
        }),
        ref: () => ({}),
    },
    block: {
        [props]: {
            key: [String, Symbol],
        },
        [props]: {
            position: ['center', 'left', 'right'],
        },
        img: () => ({
            src: String,
            alt: String,
        })
    },
    math: {
        formula: {
            inline: () => String,
            block: () => String,
        }
    },
};
