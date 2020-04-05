
const diffObject = t => [
    t.delete, // Symbol('delete') для удаления примитива
    t.primitive, // новое значение примитива, заменяет предыдущее значение
    {
        [t.array]: t`?`(true), // указывает, что значение массив, ключи будут приводится к Number
        [t.raw]: t`?`(true), // указывает, что объект нужно включать как есть, не разбирая рекурсивно
        [t(String)]: t`?`(diffObject),
        [t(Symbol)]: t`?`(diffObject) // для символьных свойств
    }
];

const D = {
    delete: Symbol('delete'),
    array: Symbol('array'),
    raw: Symbol('raw'),
    meta: Symbol('meta'),
    new: Symbol('new')
};

export const isPrimitive = value => {
    return value !== new Object(value);
}

export const raw = value => {
    if (isPrimitive(value)) {
        return value;
    }
    // return {
    //     ...value,
    //     [D.raw]: true,
    //     [D.new]: value
    // }
    value[D.raw] = true;
    value[D.new] = value;
    return value;
}


// TODO: добавить поддержку циклических ссылок
export function diff(A, B) {
    if (A === B) { // равенство по значению(для примитивов), либо по ссылке(для объектов)
        return {};
    }
    if (isPrimitive(A)) {
        if (isPrimitive(B)) {
            return B;
        } else {
            return raw(B);
        }
    } else {
        if (isPrimitive(B)) {
            return B;
        } else {
            if (typeof A === 'function') { // для функций заменяем всё, возможно стоит добавить другую проверку
                if (A === B) {
                    return {};
                } else if (A.toString() === B.toString()) {
                    return {};
                }
                return raw(B);
            } else if (Array.isArray(A)) {
                if (Array.isArray(B)) { // сравнение массивов
                    const lA = A.length;
                    const lB = B.length;
                    const max = lA > lB ? lA : lB;
                    const min = lA < lB ? lA : lB;
                    const result = {};
                    for (let i = 0; i < max; i++) {
                        if (i < min) { // сравниваем общую часть
                            const indexDiff = diff(A[i], B[i]); // сравниваем элементы
                            if (isPrimitive(indexDiff) || indexDiff === D.delete || Object.keys(indexDiff).length > 0 || indexDiff[D.raw]) {
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
                    }
                    return result;
                } else { // просто всё затираем
                    return raw(B);
                }
            } else { // обычный объект
                if (typeof B === 'function' || Array.isArray(B)) { // не обычный объект
                    return raw(B);
                } else { // сравнение объектов
                    const result = {};
                    for (const key of Object.keys(B)) {
                        if (!(key in A)) {
                            result[key] = raw(B[key]); // новые ключи добавляем как есть
                        }
                    }
                    for (const key of Object.keys(A)) {
                        if (key in B) {
                            const keyDiff = diff(A[key], B[key]); // сравниваем рекурсивно
                            if (isPrimitive(keyDiff) || keyDiff === D.delete || Object.keys(keyDiff).length > 0 || keyDiff[D.raw]) {
                                result[key] = keyDiff; // добавляем только отличия
                            }
                        } else {
                            result[key] = D.delete; // удаляем старые ключи
                        }
                    }
                    return result;
                }
            }
        }
    }
}

diff.symbols = D;

// console.log(diff([1,2,3,6,8], [1,4,3,2]));
// console.log(diff({a:[1]}, {a:[2]}));
// console.log(diff({a:1,b:2, c:{}}, {a:2, c: {a:{s:{}}}}));
// console.log(document.head);
// console.log(document.body);
// console.log(diff(document.head, document.body));
