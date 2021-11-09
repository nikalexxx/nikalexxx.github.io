import {
    Component,
    S
} from '../utils';

export default Component.PauseIcon(({props}) => () =>
    S.svg
        ['aria-hidden']`true`
        .focusable`false`
        .role`img`
        .xmlns`http://www.w3.org/2000/svg`
        .viewBox`0 0 448 512`
        ._props(props())
    (
        S.path
            .fill`currentColor`
            .d`M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z`
    )
);
