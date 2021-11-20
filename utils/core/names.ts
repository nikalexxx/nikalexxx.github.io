type LatinLetter =
    | 'a'
    | 'b'
    | 'c'
    | 'd'
    | 'e'
    | 'f'
    | 'g'
    | 'h'
    | 'i'
    | 'j'
    | 'k'
    | 'l'
    | 'm'
    | 'n'
    | 'o'
    | 'p'
    | 'q'
    | 'r'
    | 's'
    | 't'
    | 'u'
    | 'v'
    | 'w'
    | 'x'
    | 'y'
    | 'z';

export type IsLatin<T extends string> = T extends `${
    | LatinLetter
    | Capitalize<LatinLetter>}${infer X}`
    ? IsLatin<X>
    : T extends ''
    ? true
    : false;

type y = IsLatin<'NAm'>
