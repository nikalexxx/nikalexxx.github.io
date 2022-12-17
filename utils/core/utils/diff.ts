import { isObject, isPrimitive, Primitive, setType } from './type-helpers';

const diffObjectSchema = (t: any) => [
    t.delete, // Symbol('delete') для удаления примитива
    t.primitive, // новое значение примитива, заменяет предыдущее значение
    {
        [t.array]: t`?`(true), // указывает, что значение массив, ключи будут приводится к Number
        [t.raw]: t`?`(true), // указывает, что объект нужно включать как есть, не разбирая рекурсивно
        [t(String)]: t`?`(diffObject),
        [t(Symbol)]: t`?`(diffObject), // для символьных свойств
    },
];

export const deleteSymbol = Symbol('delete');
export const emptySymbol = Symbol('empty');
export const arraySymbol = Symbol('array');
export const rawSymbol = Symbol('raw');
export const metaSymbol = Symbol('meta');
export const newSymbol = Symbol('new');

const D = {
    delete: deleteSymbol,
    empty: emptySymbol,
    array: arraySymbol,
    raw: rawSymbol,
    meta: metaSymbol,
    new: newSymbol,
} as const;

type DiffOp = typeof D;

type EXTENDS<A, B> = [A, B];
type AND<
    A extends EXTENDS<any, any>,
    B extends EXTENDS<any, any>,
    IfT,
    IfF
> = A[0] extends A[1] ? (B[0] extends B[1] ? IfT : IfF) : IfF;
type OR<
    A extends EXTENDS<any, any>,
    B extends EXTENDS<any, any>,
    IfT,
    IfF
> = A[0] extends A[1] ? IfT : B[0] extends B[1] ? IfT : IfF;

export type DiffByKeys<
    A extends Record<any, any>,
    B extends Record<any, any>,
    Meta = any
> = {
    [J in keyof (A & B)]: Diff<A[J], B[J], Meta>;
};

export type Diff<RawA = any, RawB = any, Meta = any> =
    | DiffOp['delete']
    | DiffOp['empty']
    | (Primitive & RawB)
    | ({
          [arraySymbol]?: true;
          [metaSymbol]?: any;
      } & (RawA extends Record<any, any>
          ? RawB extends Record<any, any>
              ? DiffByKeys<RawA, RawB, Meta>
              : {}
          : {}))
    | ({
          [rawSymbol]: true;
          [arraySymbol]?: true;
          [metaSymbol]?: Meta;
      } & RawB);

/** обёртка для любого объекта */
export const raw = (value: unknown): Diff => {
    if (isPrimitive(value)) {
        return value;
    }
    setType<Record<any, any>>(value);
    value[D.raw as any] = true;
    return value as Diff;
};

export function isDiffRaw<A, B, D extends Diff<A, B>>(diff: D | B): diff is B {
    return isObject(diff) && rawSymbol in diff;
}

// TODO: добавить поддержку циклических ссылок
export function diff<T1 extends unknown, T2 extends unknown>(
    A: T1,
    B: T2
): Diff<T1, T2> {
    // равенство по значению(для примитивов), либо по ссылке(для объектов)
    // @ts-ignore
    if (A === B) {
        return D.empty;
    }

    if (isPrimitive(A)) {
        return raw(B);
    }

    if (isPrimitive(B)) {
        return B;
    }

    if (typeof A === 'function') {
        // для функций заменяем всё, возможно стоит добавить другую проверку
        if (A === B) {
            return D.empty;
        } else if (typeof B === 'function' && A.toString() === B.toString()) {
            return D.empty;
        }
        return raw(B);
    }

    if (Array.isArray(A)) {
        if (!Array.isArray(B)) {
            // просто всё затираем
            return raw(B);
        }
        // сравнение массивов
        return diffArray(A, B);
    }

    // A - обычный объект
    if (typeof B === 'function' || Array.isArray(B)) {
        // не обычный объект
        return raw(B);
    }

    // сравнение объектов
    setType<Record<any, any>>(A);
    setType<Record<any, any>>(B);
    return diffObject(A, B);
}

/** сравнение массивов */
export function diffArray<L1 extends any[], L2 extends any[]>(
    A: L1,
    B: L2,
    compare: (l1: L1, l2: L2) => Diff = diff
): Diff<L1, L2> {
    const lA = A.length;
    const lB = B.length;
    const max = lA > lB ? lA : lB;
    const min = lA < lB ? lA : lB;
    const result: Diff = {};
    for (let i = 0; i < max; i++) {
        if (i < min) {
            // сравниваем общую часть
            const indexDiff = compare(A[i], B[i]); // сравниваем элементы
            if (indexDiff !== D.empty) {
                result[String(i)] = indexDiff; // добавляем только отличия
            }
        } else if (lA < lB) {
            result[String(i)] = B[i]; // новые элементы
        } else {
            result[String(i)] = D.delete; // удаляем лишние
        }
    }
    if (Object.keys(result).length > 0) {
        result[D.array] = true;
        return result;
    } else {
        return D.empty;
    }
}

export function diffObject<
    O1 extends Record<any, any>,
    O2 extends Record<any, any>
>(A: O1, B: O2, compare: (o1: O1, o2: O2) => Diff = diff): Diff {
    const result: Diff = {};
    for (const key of Object.keys(B)) {
        if (!A.hasOwnProperty(key)) {
            result[key] = raw(B[key]); // новые ключи добавляем как есть
        }
    }
    for (const key of Object.keys(A)) {
        if (!B.hasOwnProperty(key)) {
            result[key] = D.delete; // удаляем старые ключи
            continue;
        }
        const keyDiff = compare(A[key], B[key]); // сравниваем рекурсивно
        if (keyDiff !== D.empty) {
            result[key] = keyDiff; // добавляем только отличия
        }
    }
    if (Object.keys(result).length > 0) {
        return result;
    }
    return D.empty;
}

diff.symbols = D;
