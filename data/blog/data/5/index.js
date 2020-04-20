export default ({V, n, h, i, b, a, code, pre, external}) => V`
Изначально тёмная тема была, потому что я вдохновлялся тёмными темами VSCode.
Я даже взял оттуда палитру.
Но не всем привычна тёмная тема, да и сделать светлую тему с помощью css оказалось легко.

Прежде всего я навёл порядок в ${a('/?/design/colors')('цветах')}, особенно в градациях серого.


Тёмная тема осталась по умолчанию, а светлая тема включается классом ${code('theme_light')} на элементе body.
Для каждой темы я перечисляю цвета для текста, фонов и границ:
${pre(`
:root {
    --color-text: var(--color-gray-light);
    --color-text-active: var(--color-blue);
    --color-text-accent: var(--color-red);
    --color-background: var(--color-dark);
    --color-background-second: var(--color-dark-black);
    --color-background-prime: var(--color-dark-gray);
    --color-background-accent: var(--color-black);
    --color-border: var(--color-black);
    --color-border-contrast: var(--color-gray-light);
}

.theme_light {
    --color-text: var(--color-dark-gray);
    --color-text-active: var(--color-blue);
    --color-text-accent: var(--color-red-light);
    --color-background: var(--color-white);
    --color-background-second: var(--color-light-white);
    --color-background-prime: var(--color-light);
    --color-background-accent: var(--color-light-gray);
    --color-border: var(--color-light-gray-medium);
    --color-border-contrast: var(--color-gray-light);
}
`)}
Пришлось у всех компонентов поменять цвета в стилях, чтобы они автоматически менялись при смене темы.

${h(3)('Смена темы')}
Кроме смены класса body, разумно сохранять тему в localStorage, чтобы запоминать выбор.
${pre(`
function setTheme() {
    const {theme} = state();
    localStorage.setItem('theme', theme);
    const classList = document.body.classList;
    if (theme === 'light') {
        classList.add('theme_light');
    } else {
        classList.remove('theme_light');
    }
    window.dispatchEvent(new CustomEvent('theme', {detail: {theme}}));
}`)}
В этой реализации state — состояние компонента шапки(там переключатель тем).
Также здесь я активирую событие, чтобы другие компоненты могли узнать об этом.


При первой загрузке мы смотрим в localStorage, и если там есть тема, берём её, иначе берём тему по умолчанию(dark).
${pre(`
state.init({
    theme: 'dark'
});

hooks.didMount(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        state.set({theme: savedTheme});
    }
    setTheme();
});
`)}

Добавим функцию переключения тем
${pre(`
function toogleTheme() {
    state.set(prevState => ({
        theme: prevState.theme === 'dark' ? 'light' : 'dark'
    }), () => setTheme());
}`)}
И будем вызывать её при клике на кнопку в шапке
${pre(`
Button.onClick(toogleTheme)(getIcon())
`)}
getIcon — функция для отрисовки иконок.
Иконки я взял среди бесплатного набора ${a('https://fontawesome.com/icons?d=gallery&m=free')('Font Awesome')}.
Для тёмной темы это луна, для светлой — солнце.
Чтобы иконки были компонентами, пришлось скопировать код svg и представить в виде прокси в js аналогично другим элементам.
Единственное отличие от обычных элементов, это пространство имён svg, для этого в движке реализован прокси ${code('S')}.
Компонент нужен для того, чтобы прокидывать свойства с уровня выше при использовании иконки.
Например, установить цвет иконки или размер.


Вот реализация компонента для иконки луны:
${pre(`
import {
    S,
    Component
} from '../utils/index.js';

export default Component.MoonIcon(({props}) => () =>
    S.svg
        ['aria-hidden']\`true\`
        .focusable\`false\`
        .role\`img\`
        .xmlns\`http://www.w3.org/2000/svg\`
        .viewBox\`0 0 512 512\`
        ._props(props)
    (
        S.path
            .fill\`currentColor\`
            .d\`M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z\`
    )
)
`)}
`;
