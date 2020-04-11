import {
    block,
    E,
    style,
    Component,
    RouteLink,
    css
} from '../../utils/index.js';

import {Breadcrumbs} from '../index.js';

import './StandardModel.less';

const b = block('standard-model');

const particles = [
    {
        name: 'электронное антинейтрино',
        symbol: E.span(E.span.style`text-decoration: overline`('ν'), E.sub('e')),
        charge: '0',
        spin: '1/2',
        mass: E.span('<1.0 eV/c', E.sup('2'))
    },
    {
        name: 'мюонное антинейтрино',
        symbol: E.span(E.span.style`text-decoration: overline`('ν'), E.sub('μ')),
        charge: '0',
        spin: '1/2',
        mass: E.span('<0.17 MeV/c', E.sup('2'))
    },
    {
        name: 'тау антинейтрино',
        symbol: E.span(E.span.style`text-decoration: overline`('ν'), E.sub('τ')),
        charge: '0',
        spin: '1/2',
        mass: E.span('<18.2 MeV/c', E.sup('2'))
    },
    {
        name: 'электронное нейтрино',
        symbol: E.span('ν', E.sub('e')),
        charge: '0',
        spin: '1/2',
        mass: E.span('<1.0 eV/c', E.sup('2'))
    },
    {
        name: 'мюонное нейтрино',
        symbol: E.span('ν', E.sub('μ')),
        charge: '0',
        spin: '1/2',
        mass: E.span('<0.17 MeV/c', E.sup('2'))
    },
    {
        name: 'тау нейтрино',
        symbol: E.span('ν', E.sub('τ')),
        charge: '0',
        spin: '1/2',
        mass: E.span('<18.2 MeV/c', E.sup('2'))
    },
    {
        name: 'W бозон',
        symbol: E.span('W'),
        charge: '±1',
        spin: '1',
        mass: E.span('≃80.39 GeV/c', E.sup('2')),
        group: 'SU(2)',
        interaction: 'weak'
    },
    {
        name: 'Z бозон',
        symbol: E.span('Z'),
        charge: '0',
        spin: '1',
        mass: E.span('≃91.19 GeV/c', E.sup('2')),
        group: 'SU(2)',
        interaction: 'weak'
    },
    {
        name: 'бозон Хиггса',
        symbol: E.span('H'),
        charge: '0',
        spin: '0',
        mass: E.span('≃124.97 GeV/c', E.sup('2')),
        interaction: 'mass'
    },
    {
        name: 'позитрон',
        symbol: E.span('e', E.sup('+')),
        charge: '+1',
        spin: '1/2',
        mass: E.span('≃0.511 MeV/c', E.sup('2'))
    },
    {
        name: 'антимюон',
        symbol: E.span('μ', E.sup('+')),
        charge: '+1',
        spin: '1/2',
        mass: E.span('≃105.66 MeV/c', E.sup('2'))
    },
    {
        name: 'антитау',
        symbol: E.span('τ', E.sup('+')),
        charge: '+1',
        spin: '1/2',
        mass: E.span('≃1.7768 GeV/c', E.sup('2'))
    },
    {
        name: 'электрон',
        symbol: E.span('e', E.sup('–')),
        charge: '-1',
        spin: '1/2',
        mass: E.span('≃0.511 MeV/c', E.sup('2'))
    },
    {
        name: 'мюон',
        symbol: E.span('μ', E.sup('–')),
        charge: '-1',
        spin: '1/2',
        mass: E.span('≃105.66 MeV/c', E.sup('2'))
    },
    {
        name: 'тау',
        symbol: E.span('τ', E.sup('–')),
        charge: '-1',
        spin: '1/2',
        mass: E.span('≃1.7768 GeV/c', E.sup('2'))
    },
    {
        name: 'фотон',
        symbol: E.span('γ'),
        charge: '0',
        spin: '1',
        mass: E.span('0'),
        modifier: 'y',
        group: 'U(1)',
        interaction: 'electromagnetic'
    },
    {
        name: 'верхний',
        symbol: E.span(E.span.style`text-decoration: overline`('u')),
        charge: '-2/3',
        spin: '1/2',
        mass: E.span('≃2.2 MeV/c', E.sup('2')),
        category: 'anti-quark',
        modifier: 'au'
    },
    {
        name: 'очаровательный',
        symbol: E.span(E.span.style`text-decoration: overline`('c')),
        charge: '-2/3',
        spin: '1/2',
        mass: E.span('≃1.28 GeV/c', E.sup('2')),
        category: 'anti-quark'
    },
    {
        name: 'истинный',
        symbol: E.span(E.span.style`text-decoration: overline`('t')),
        charge: '-2/3',
        spin: '1/2',
        mass: E.span('≃173.1 GeV/c', E.sup('2')),
        category: 'anti-quark'
    },
    {
        name: 'верхний',
        symbol: E.span('u'),
        charge: '2/3',
        spin: '1/2',
        mass: E.span('≃2.2 MeV/c', E.sup('2')),
        category: 'quark'
    },
    {
        name: 'очаровательный',
        symbol: E.span('c'),
        charge: '2/3',
        spin: '1/2',
        mass: E.span('≃1.28 GeV/c', E.sup('2')),
        category: 'quark'
    },
    {
        name: 'истинный',
        symbol: E.span('t'),
        charge: '2/3',
        spin: '1/2',
        mass: E.span('≃173.1 GeV/c', E.sup('2')),
        category: 'quark'
    },
    {
        name: 'глюон',
        symbol: E.span('g'),
        charge: '0',
        spin: '1',
        mass: E.span('0'),
        modifier: 'g',
        group: 'SU(3)',
        interaction: 'strong'
    },
    {
        name: 'нижний',
        symbol: E.span(E.span.style`text-decoration: overline`('d')),
        charge: '1/3',
        spin: '1/2',
        mass: E.span('≃4.7 MeV/c', E.sup('2')),
        category: 'anti-quark',
        modifier: 'ad'
    },
    {
        name: 'странный',
        symbol: E.span(E.span.style`text-decoration: overline`('s')),
        charge: '1/3',
        spin: '1/2',
        mass: E.span('≃96 MeV/c', E.sup('2')),
        category: 'anti-quark'
    },
    {
        name: 'прелестный',
        symbol: E.span(E.span.style`text-decoration: overline`('b')),
        charge: '1/3',
        spin: '1/2',
        mass: E.span('≃4.18 GeV/c', E.sup('2')),
        category: 'anti-quark'
    },
    {
        name: 'нижний',
        symbol: E.span('d'),
        charge: '-1/3',
        spin: '1/2',
        mass: E.span('≃4.7 MeV/c', E.sup('2')),
        category: 'quark'
    },
    {
        name: 'странный',
        symbol: E.span('s'),
        charge: '-1/3',
        spin: '1/2',
        mass: E.span('≃96 MeV/c', E.sup('2')),
        category: 'quark'
    },
    {
        name: 'прелестный',
        symbol: E.span('b'),
        charge: '-1/3',
        spin: '1/2',
        mass: E.span('≃4.18 GeV/c', E.sup('2')),
        category: 'quark'
    }
]

const StandardModel = Component.StandardModel(({state}) => {

    function renderTile({name, symbol, charge, spin, mass, category, modifier, group, interaction} = {}, i, view = false) {
        const {i: current} = state();
        return E.div.update(false).class(b('tile', modifier ? {mode: modifier} : {}))(E.div.style(`display: grid; grid-template-rows: auto 1fr ${view ? 'auto' : '3em'};cursor: pointer`)['data-interaction'](interaction)['data-i'](i)['data-view'](view ? 1 : 0).class(current === i ? b('current') : '').onClick((e) => {
            const {interaction, i, view} = (e.target.closest('.' + b('tile')).firstChild.dataset);
            if (+view) {
                return;
            }
            if (interaction) {
                state.set({
                    interaction: state().i === +i ? undefined : interaction
                });
            }
            state.set(prev => ({i: +i === prev.i ? undefined : +i}));
        })(
            E.div.style`display:grid;grid-template-columns: 1fr auto`(
                E.div.style(`font-size: ${view ? '1' : '.8'}em;`)(
                    view && 'масса: ',
                    mass
                )
            ),
            E.div.style(view ? '' : `display:grid;grid-template-columns: auto 1fr`)(
                E.div.style(`font-size: ${view ? '1' : '.8'}em;`)(
                    E.div(
                        view && 'спин: ',
                        spin
                    ),
                    E.div(
                        view && 'заряд: ',
                        charge
                    ),
                    group && E.div(
                        view && 'группа симметрии: ',
                        group
                    ),
                    view && interaction && interaction !== 'mass' && E.div(
                        'Переносчик ' + {strong: 'сильного', 'electromagnetic': 'электромагнитного', 'weak': 'слабого'}[interaction] + ' взаимодействия'
                    )
                ),
                E.div.style(`font-size: ${view ? 5 : 3}em;font-weight: 100;font-family:serif; display:flex; justify-content: center; align-items: center;margin-right: .3em; padding: .5em 0 .2em 0;${view ? 'margin-top: .1em;' : ''}`)(E.div.class(b('symbol'))(symbol))
            ),
            E.div.style(`font-size: 1em;  display:flex; justify-content: center; align-items: center; text-align: center;  line-height: 1.1em; ${view ? 'padding-bottom: 1em;' : ''}`)(E.div(
                E.div.style(view ? 'font-size: 2em; line-height: 1.5em;' : '')(
                    name,
                    view && category === 'quark' && ' кварк',
                    view && category === 'anti-quark' && ' антикварк'
                ),
            category === 'quark' && E.div.class(b('colors'))(
                view && ['цветовой заряд:  ', E.br],
                ['red', 'green', 'blue'].map(color => E.div.class(b('color', {[color]: true})))
            ),
            category === 'anti-quark' && E.div.class(b('colors'))(
                view && ['цветовой заряд: ', E.br],
                ['antired', 'antigreen', 'antiblue'].map(color => E.div.class(b('color', {[color]: true})))
            ),
            name === 'глюон' && E.div.class(b('colors'))(
                view && ['цветовой заряд: ', E.br],
                ['red-antiblue', 'blue-antigreen', 'green-antired', 'red-antigreen', 'blue-antired', 'green-antiblue', 'g3', 'g8'].map(color => E.div.class(b('color', {[color]: true, gluon: true}))(
                    color === 'g3' ? '3' : color === 'g8' ? '8' : null
                ))
            )
        ))))
    }

    return () => {
        const {interaction, i} = state();
        return E.div(
            Breadcrumbs.items([['Физика', 'physics'], ['Стандартная модель']]),
            E.div.class(b())(
                E.h2('Стандартная модель элементарных частиц'),
                E.div.class(b('table'))(
                    E.div.class(b('area', {fermions: true}))('фермионы'),
                    E.div.class(b('area', {bosons: true}))('бозоны'),
                    E.div.class(b('area', {anti: true}))('античастицы'),
                    E.div.class(b('area', {normal: true}))('частицы'),
                    E.div.class(b('area', {vector: true}))('векторные'),
                    E.div.class(b('area', {scalar: true}))('скалярный'),
                    E.div.class(b('area', {leptons: true}))(
                        E.div.style`display: flex; justify-content: flex-end; align-items: flex-end; height: 100%`('лептоны')
                    ),
                    E.div.class(b('area', {quarks: true}))(
                        E.div.style`display: flex; justify-content: flex-end; align-items: flex-start; height: 100%`('кварки')
                    ),
                    interaction === 'weak' && [
                        E.div.class(b('weak', {part: 1})),
                        E.div.class(b('weak', {part: 2}))
                    ],
                    interaction === 'electromagnetic' && [
                        E.div.class(b('electromagnetic', {part: 1})),
                        E.div.class(b('electromagnetic', {part: 2})),
                        E.div.class(b('electromagnetic', {part: 3}))
                    ],
                    interaction === 'strong' && [
                        E.div.class(b('strong', {part: 1})),
                        E.div.class(b('strong', {part: 2}))
                    ],
                    interaction === 'mass' && [
                        E.div.class(b('higgs', {part: 1})),
                        E.div.class(b('higgs', {part: 2}))
                    ],
                    E.div.class(b('border', {['anti-normal']: true})),
                    E.div.class(b('border', {['fermions-bosons']: true})),
                    E.div.class(b('border', {['leptons-quarks']: true})),
                    E.div.class(b('border', {['vector-scalar']: true})),
                    particles.map((e, i) => renderTile(e, i)),
                    i !== undefined && (
                        E.div.class(b('big-tile'))(renderTile(particles[i], undefined, true))
                    ),
                    [1, 2, 3, 1, 2, 3].map((k, i) => E.div.class(b('generation', {start: i === 0}))(k)),
                    E.div.style`grid-column: 2 / 8; text-align: center`('Поколения')
                ),
                E.p.update(false)(
                    'Взаимодействия: ',
                    E.span.class(b('interaction', {type: 'strong'}))('сильное'), ', ',
                    E.span.class(b('interaction', {type: 'electromagnetic'}))('электромагнитное'), ' и ',
                    E.span.class(b('interaction', {type: 'weak'}))('слабое'), '. Также добавлено ',
                    E.span.class(b('higgs-field'))('поле Хиггса'),
                    E`. При нажатии на карточки частиц бозонов — квантов соответствующих полей, будут подсвечены все частицы, на которые действует поле. Значения масс для частиц взяты со страницы ${E.a.href('https://en.wikipedia.org/wiki/Standard_Model')('Стандартной модели')} в википедии. Выделение антинейтрино как отдельных частиц в таблице не значит, что они являются фермионами Дирака, а сделано исключительно для визуального удобства.`
                )
            )
        );
    }
});

export default StandardModel;
