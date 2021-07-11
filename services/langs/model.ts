import { Lang } from './langs';

const map: Map<string, string> = new Map();
export const defaultLang: Lang = 'ru';

let currentLang: Lang = defaultLang;

/**
 * первый раз вызывать перед первым применением функции token
 */
export const setLang = (lang: Lang) => (currentLang = lang);

export const token = (name: string) => {
    return (
        map.get(`${currentLang}/${name}`) ?? map.get(`${defaultLang}/${name}`)
    );
};

export function addToken<S extends string>(
    name: S,
    value: Partial<Record<Lang, string>>
) {
    for (const lang of Object.keys(value)) {
        map.set(`${lang}/${name}`, value[lang]);
    }
}
