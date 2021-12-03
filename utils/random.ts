import { memo } from './memo';

const rand = (start, end) => () =>
    Math.floor(start + Math.random() * (end - start));

export const randInRange = memo((limit: number, end?: number) => {
    if (end !== undefined) {
        return rand(limit, end);
    }
    return rand(0, limit);
});
