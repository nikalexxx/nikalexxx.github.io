import { Component, E } from '../../../utils';
import { Breadcrumbs } from '../../../components';
import { Button } from '../../../blocks';

const imgPath = '/data/images/schemes/blood-types';

let currentListener;

export const BloodTypes = Component.BloodTypes(({ state, hooks }) => {
    state.init({
        theme: localStorage.getItem('theme'),
    });

    hooks.didMount(() => {
        if (currentListener) {
            window.removeEventListener('theme', currentListener);
            currentListener = null;
        }
        currentListener = window.addEventListener('theme', (e) => {
            state.set({ theme: e.detail.theme });
        });
    });

    return () => {
        const { theme } = state();
        return E.div(
            Breadcrumbs.items([['Проекты', 'projects'], ['Группы крови']]),
            E.div.style`padding: 16px;`(
                E.br,
                E.p(`${theme === 'light' ? 'Светлая' : 'Тёмная'} версия`),
                E.picture(
                    E.img.src(`${imgPath}/${theme}.svg`).width`722px`
                        .height`649px`
                ),
                E.p`Указаны разрешенные направления переливаний эритроцитной массы в зависимости от группы в системе AB0 и резус-фактора. Также указаны направления переливания плазмы.`,
                E.br,
                E.p`Схема доступна для скачивания.`,
                E.div.style`display: flex; gap: 8px; padding: 8px 0`(
                    'Светлая тема: скачать',
                    E.a.href(`${imgPath}/light.png`)`png`,
                    E.a.href(`${imgPath}/light.svg`)`svg`,
                    E.a.href(`${imgPath}/light.pdf`)`pdf`
                ),
                E.div.style`display: flex; gap: 8px; padding: 8px 0`(
                    'Тёмная тема: скачать',
                    E.a.href(`${imgPath}/dark.png`)`png`,
                    E.a.href(`${imgPath}/dark.svg`)`svg`,
                    E.a.href(`${imgPath}/dark.pdf`)`pdf`
                )
            )
        );
    };
});
