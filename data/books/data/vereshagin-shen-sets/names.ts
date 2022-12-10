import { BookApi } from '@bookbox/preset-web';
import { getCustomElements } from './elements.js';

export default (api: BookApi) => {
    const { book, area, link } = api;

    const { chapter } = getCustomElements(api);
    return book`
${chapter.noIndex(true)`Указатель имён`}
${area.key('name_banach')`
${link.href('https://ru.wikipedia.org/wiki/Банах,_Стефан')`Банах С. (Stefan Banach)`}, 30.03.1892 (Krako´v, ныне в Польше) – 31.08.1945 (Львiв, ныне в Украине)
`}


${area.key('name_bernstein')`
${link.href('https://ru.wikipedia.org/wiki/Бернштейн,_Феликс')`Бернштейн Ф. (Felix Bernstein)`}, 24.02.1878, Halle (Германия) – 03.12.1956, Zurich (Швейцария)
`}


${area.key('name_borel')`
${link.href('https://ru.wikipedia.org/wiki/Борель,_Эмиль')`Борель Э. (Fe´lix Edouard Justin E´mile Borel)`}, 07.01.1871, Saint Affrique, A´veyron, Midi-Pyre´ne´es (Франция) – 03.02.1956, Paris (Франция)
`}


${area.key('name_brouwer')`
${link.href('https://ru.wikipedia.org/wiki/Брауэр,_Лёйтзен_Эгберт_Ян')`Брауэр Л. Э. Я. (Luitzen Egbertus Jan Brouwer)`}, 27.02.1881, Overschie (ныне в Роттердаме, Нидерланды) – 02.12.1966, Blaricum (Нидерланды)
`}


${area.key('name_forti')`
${link.href('https://en.wikipedia.org/wiki/Cesare_Burali-Forti')`Бурали-Форти (Cesare Burali-Forti)`}, 13.08.1861, Arezzo (Италия) – 21.01.1931, Turin (Италия)
`}


${area.key('name_wiener')`
${link.href('https://ru.wikipedia.org/wiki/Винер,_Норберт')`Винер Н. (Norbert Wiener)`}, 26.11.1894, Columbia, Missouri (США) – 18.03.1964, Stockholm (Швеция)
`}


${area.key('name_galilei')`
${link.href('https://ru.wikipedia.org/wiki/Галилей,_Галилео')`Галилей Г. (Galileo Galilei)`}, 15.02.1564, Pisa (ныне в Италии) – 08.01.1642, Arcetri, рядом с Флоренцией (Италия)
`}


${area.key('name_hamel')`
${link.href('https://en.wikipedia.org/wiki/Georg_Hamel')`Гамель (Georg Karl Wilhelm Hamel)`}, 12.09.1877, Du\u0308ren, Rheinland (Германия) – 04.10.1954, Landshut (Германия)
`}


${area.key('name_godel')`
${link.href('https://ru.wikipedia.org/wiki/Гёдель,_Курт')`Гёдель К. (Kurt Go\u0308del)`}, 28.04.1906, Bru\u0308nn, Австро-Венгрия (ныне Брно, Чехия) – 14.01.1978, Princeton (США)
`}


${area.key('name_hilbert')`
${link.href('https://ru.wikipedia.org/wiki/Гильберт,_Давид')`Гильберт Д. (David Hilbert)`}, 23.01.1862, Ko\u0308nigsberg, Prussia (ныне Калиниград, Россия) – 14.02.1943, Go\u0308ttingen (Германия)
`}


${area.key('name_dedekind')`
${link.href('https://ru.wikipedia.org/wiki/Дедекинд,_Рихард')`Дедекинд Р. (Julius Wilhelm Richard Dedekind)`}, 06.10.1831, Braunschweig (ныне Германия) – 12.02.1916, Braunschweig (Германия)
`}


${area.key('name_euclid')`
${link.href('https://ru.wikipedia.org/wiki/Евклид')`Евклид Александрийский`}, около 325 (?) до Р. Х. – около 265 (?) до Р. Х., Александрия (ныне Египет)
`}


${area.key('name_cantor')`
${link.href('https://ru.wikipedia.org/wiki/Кантор,_Георг')`Кантор Г. (Georg Ferdinand Ludwig Philipp Cantor)`}, 03.03.1845, Петербург (Россия) – 06.01.1918, Halle (Германия)
`}


${area.key('name_konig')`
${link.href('https://en.wikipedia.org/wiki/Gyula_Kőnig')`Кёниг Ю. (Julius Ko\u0308nig)`}, 16.12.1849, Gyo\u0308r (Венгрия) – 08.04.1913, Budapest (Венгрия)
`}


${area.key('name_cohen')`
${link.href('https://ru.wikipedia.org/wiki/Коэн,_Пол_Джозеф')`Коэн П. Дж. (Paul Joseph Cohen)`}, 02.04.1934, Long Branch, New Jersey (США) – 23.03.2007, Stanford, California (США)
`}


${area.key('name_kuratowski')`
${link.href('https://ru.wikipedia.org/wiki/Куратовский,_Казимеж')`Куратовский К. (Kazimierz Kuratowski)`}, 02.02.1896, Warsaw, Польша (Россия) – 18.06.1980, Warsaw (Польша)
`}


${area.key('name_lindemann')`
${link.href('https://ru.wikipedia.org/wiki/Линдеман,_Фердинанд_фон')`Линдеман Ф. (Carl Louis Ferdinand von Lindemann)`}, 12.04.1852, Hannover (ныне Германия) – 06.03.1939, Munich (Германия)
`}


${area.key('name_liouville')`
${link.href('https://ru.wikipedia.org/wiki/Лиувилль,_Жозеф')`Лиувилль Ж. (Joseph Liouville)`}, 24.03.1809, Saint-Omer (Франция) – 08.09.1882, Paris (Франция)
`}


${area.key('name_lobachevski')`
${link.href('https://ru.wikipedia.org/wiki/Лобачевский,_Николай_Иванович')`Лобачевский Николай Иванович`}, 01.12.1792, Нижний Новгород (Россия) – 24.02.1856, Казань (Россия)
`}


${area.key('name_neumann')`
${link.href('https://ru.wikipedia.org/wiki/Нейман,_Джон_фон')`Нейман Дж. (John von Neumann)`}, 28.12.1903, Budapest (Венгрия) – 08.02.1957, Washington, D.C. (США)
`}


${area.key('name_newton')`
${link.href('https://ru.wikipedia.org/wiki/Ньютон,_Исаак')`Ньютон И. (Sir Isaac Newton)`}, 04.01.1643, Woolsthorpe, Lincolnshire (Англия) – 31.03.1727, London (Англия)
`}


${area.key('name_peano')`
${link.href('https://ru.wikipedia.org/wiki/Пеано,_Джузеппе')`Пеано Дж. (Giuseppe Peano)`}, 27.08.1858, Cuneo, Piemonte (Италия) – 20.04.1932, Turin (Италия)
`}


${area.key('name_ramsey')`
${link.href('https://ru.wikipedia.org/wiki/Рамсей,_Фрэнк_Пламптон')`Рамсей Ф. (Frank Plumpton Ramsey)`}, 22.02.1903, Cambridge, Cambridgeshire (Англия) – 19.01.1930, London (Англия)
`}


${area.key('name_russell')`
${link.href('https://ru.wikipedia.org/wiki/Рассел,_Бертран')`Рассел Б. (Bertrand Arthur William Russell)`}, 18.05.1872, Ravenscroft, Trelleck, Monmouthshire (Уэльс, Великобритания) – 02.02.1970, Penrhyndeudraeth, Merioneth (Уэльс, Великобритания)
`}


${area.key('name_tarski')`
${link.href('https://ru.wikipedia.org/wiki/Тарский,_Альфред')`Тарский А. (Alfred Tarski)`}, 14.01.1901, Warsaw (Россия, ныне Польша) – 26.10.1983, Berkeley, California (США)
`}


${area.key('name_fraenkel')`
${link.href('https://ru.wikipedia.org/wiki/Френкель,_Абрахам')`Френкель А. А. (Adolf Abraham Halevi Fraenkel)`}, 17.02.1891, Munich (Германия) – 15.10.1965, Jerusalem (Израиль)
`}


${area.key('name_fubini')`
${link.href('https://ru.wikipedia.org/wiki/Фубини,_Гвидо')`Фубини Г. (Guido Fubini)`}, 19.01.1879, Venice (Италия) – 06.06.1943, New York (США)
`}


${area.key('name_zermelo')`
${link.href('https://ru.wikipedia.org/wiki/Цермело,_Эрнст')`Цермело Э. (Ernst Friedrich Ferdinand Zermelo)`}, 27.07.1871, Berlin (Германия) – 21.05.1953, Freiburg im Breisgau (Германия)
`}


${area.key('name_zorn')`
${link.href('https://ru.wikipedia.org/wiki/Цорн,_Макс_Август')`Цорн М. (Max August Zorn)`}, 06.06.1906, Krefeld (Германия) – 09.03.1993, Bloomington, Indiana (США)
`}


${area.key('name_schroder')`
${link.href('https://ru.wikipedia.org/wiki/Шрёдер,_Эрнст')`Шрёдер Э. (Friedrich Wilhelm Karl Ernst Schro\u0308der)`}, 25.11.1841, Mannheim (Германия) – 16.06.1902, Karlsruhe (Германия)
`}


${area.key('name_hermite')`
${link.href('https://ru.wikipedia.org/wiki/Эрмит,_Шарль')`Эрмит Ш. (Charles Hermite)`}, 24.12.1822, Dieuze, Lorraine (Франция) – 14.01.1901, Paris (Франция)
`}
`;
};
