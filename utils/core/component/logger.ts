import { style } from '../../style';

export function logAdd(element: any) {
    console.log(
        '%c + ',
        style({
            color: 'green',
            backgroundColor: '#dfd',
        }),
        element
    );
}

export function logRemove(element: any) {
    console.log(
        '%c - ',
        style({
            color: 'red',
            backgroundColor: '#fdd',
        }),
        element
    );
}
