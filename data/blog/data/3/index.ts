import type { BookApi } from "@bookbox/preset-web";

export default (api: BookApi) => {
    const {book, external, format, code, link, header} = api;
    const {pre} = format;
    return book`
Я сразу решил, что сайт должен быть интерактивным.


${header.level(3)('Историческое пояснение')}
Есть старый подход к созданию сайтов: структура страницы на html, оформление на css, интерактивность на js.
Но такой подход приводил к запутанному коду, необходимо было самому следить за состоянием страницы.
В итоге стали популярны фронтенд фреймворки, которые сами следили за обновлением DOM дерева, такие как ${link.href('https://reactjs.org')('React')}, ${link.href('https://angular.io')('Angular')} и ${link.href('https://vuejs.org')('Vue')}. React и Vue используют концепцию Virtual DOM. Мы держим в памяти облегченную аналог DOM в виде объектов, сравниваем их и при обнаружении изменений обновляем элементы на странице.


${header.level(3)('Что выбрать?')}
Фреймворки, не использующие полное сравнение виртуальных моделей, мне не нравились из-за того, что они требуют введения специфического dsl для условий и циклов.
В таких фреймворках верстку нельзя генерировать функцией.
Но благодаря контролю структуры компонентов, можно повысить производительность.
React производит полное сравнение, однако он всё равно достаточно быстрый.
Новые фреймворки вообще не используют виртуальное дерево, например ${link.href('https://svelte.dev')('Svelte')}.
Но там происходит генерация кода при компиляции, что несомненно хорошо для небольших приложений.
Я бы назвал это тупым решением в лоб.
При разрастании приложения объём сгенерированного кода превысит объём кода рантайм-машины фреймворка c virtual DOM.
И конечно, из-за отсутствия рантайма нельзя генерировать верстку функциями и требуется очередной dsl.


Проблема React в его излишней сложности. Поэтому я, как программист, написал свой инструмент.


${header.level(3)('Как всё работает?')}
Я решил написать минимальную рабочую версию, которая бы решала поставленные задачи и больше ничего.
Без хитрых оптимизаций. И конечно, чтобы доказать самому себе, что я могу это сделать.


Вся верстка генерируется скриптами.
Не стану скрывать, я вдохновлялся react, стараясь брать наиболее привлекательные для меня черты.


Вот как выглядит элемент в коде:
${code.lang('javascript')(`
const element = E.div.class('container')(
    E.h4('title'),
    E.p('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
    E.br,
    E.b('bold '),
    E.span.style\`color: red;\`('red text '),
    E.button.onClick(() => alert('hi!'))('Say "hi!"'),
    E.ul(
        E.li\`A\`,
        E.li\`B\`,
        E.li\`C\`
    )
)
`)}


На странице он будет выглядеть так:


${external.scope('parvis')(`({E}) => E.div.class('container')(
    E.h4('title'),
    E.p('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
    E.br,
    E.b('bold '),
    E.span.style\`color: red;\`('red text '),
    E.button.onClick(() => alert('hi!'))('Say "hi!"'),
    E.ul(
        E.li\`A\`,
        E.li\`B\`,
        E.li\`C\`
    )
)`)}


А так выглядит простейший компонент:
${code.lang('javascript')(`
const SimpleComponent = Component.SimpleComponent(({props, state}) => {
    state.init({count: 0});
    return () => {
        const {color} = props;
        const {count} = state();
        return E.div(
            E.span.style(\`color: \${color};\`)(String(count)),
            E.br,
            E.button.onClick(() => state.set(prevState => ({count: prevState.count - 1})))('-'),
            E.button.onClick(() => state.set(prevState => ({count: prevState.count + 1})))('+')
        )
    }
});
`)}


Его использование:
${code.lang('javascript')(`
const greenCounter = SimpleComponent.color('green');
`)}


В действии:
${external.scope('parvis')(`({E, Component}) => {
    const SimpleComponent = Component.SimpleComponent(({props, state}) => {
        state.init({count: 0});
        return () => {
            const {color} = props();
            const {count} = state();
            return E.div(
                E.span.style(\`color: \${color};\`)(String(count)),
                E.br,
                E.button.onClick(() => state.set(prevState => ({count: prevState.count - 1})))('-'),
                E.button.onClick(() => state.set(prevState => ({count: prevState.count + 1})))('+')
            )
        }
    });
    return SimpleComponent.color('green');
}`)}


${header.level(3)('Под капотом')}
Внутри реализация virtual DOM.
Прокси ${pre('E')} создаёт абстракцию над html элементом(есть ещё ${pre('S')} для svg и ${pre('M')} для MathML).
Прокси ${pre('Component')} позволяет использовать такие абстракции, как свойства и состояние.


Когда состояние компонента меняется, вычисляется diff между старым и новым объектом.
Далее рекурсивный проход по DOM на странице и обновление согласно полученному diff.
Подробнее можно посмотреть в ${link.href('https://github.com/nikalexxx/nikalexxx.github.io/tree/master/utils')('репозитории')} на Github.


${header.level(3)('Использование')}
Этот сайт полностью работает на этом движке.
Для иллюстрации я показал использование с большим количеством элементов на странице — ${link.href('/?/projects/unicode')('отображение Юникода')}.
В будущем попробую привести код в порядок и сделать библиотеку на его основе.
`;
};
