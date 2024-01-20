import { Breadcrumbs } from '../../../components';
import { Lang } from '../../../blocks';
import { Component } from 'parvis';

const imgPath = '/data/images/schemes/blood-types';

let currentListener: EventListener | null;

export const BloodTypes = Component('BloodTypes', ({ state, hooks }) => {
    const [getTheme, setTheme] = state(localStorage.getItem('theme'));

    hooks.mount(() => {
        if (currentListener) {
            window.removeEventListener('theme', currentListener);
            currentListener = null;
        }
        currentListener = (e) => {
            setTheme(e.detail.theme);
        };

        window.addEventListener('theme', currentListener);
    });

    return () => {
        const theme = getTheme();
        return <div>
            <Breadcrumbs items={([[<Lang token={`menu/projects`} />, 'projects'], ['Группы крови']])} />
            <div style={`padding: 16px;`}>
                <br />
                <p>{theme === 'light' ? 'Светлая' : 'Тёмная'} версия</p>
                <picture>
                    <img src={(`${imgPath}/${theme}.svg`)} style={`width: 100%; max-height: 90vh`} />
                </picture>
                <p>Указаны разрешенные направления переливаний эритроцитной массы в зависимости от группы в системе AB0 и резус-фактора. Также указаны направления переливания плазмы.</p>
                <br />
                <p>Схема доступна для скачивания.</p>
                <div style={`display: flex; gap: 8px; padding: 8px 0`}>
                    Светлая тема: скачать
                    <a href={`${imgPath}/light.png`}>png</a>
                    <a href={`${imgPath}/light.svg`}>svg</a>
                    <a href={`${imgPath}/light.pdf`}>pdf</a>
                </div>
                <div style={`display: flex; gap: 8px; padding: 8px 0`}>
                    Тёмная тема: скачать
                    <a href={`${imgPath}/dark.png`}>png</a>
                    <a href={`${imgPath}/dark.svg`}>svg</a>
                    <a href={`${imgPath}/dark.pdf`}>pdf</a>
                </div>
            </div>
        </div>
    };
});
