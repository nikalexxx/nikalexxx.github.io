import { BookApi } from "@bookbox/preset-web";

export default (api: BookApi) => {
    const {book, code, format: {pre}} = api;
    return book`
На экранах малой ширины меню отъедает часть полезного пространства.
Поэтому я решил скрывать его, если ширина экрана меньше 700px.
В таком случае появляется кнопка-гамбургер, при нажатии на которую меню всплывает поверх всего.
Меню скрывается при выборе элемента либо при клике на область вне меню.
${code.block().lang('less')(`
&__menu {
    grid-area: menu;
    background-color: var(--color-background-second);

    @media (max-width: 700px) {
        position: fixed;
        top: 0;
        bottom: 0;
        left: -100vw;
        z-index: 900;
        padding-top: 1em;
        box-shadow: 0 0 3em rgba(0,0,0,1);
        border-right: 1px solid var(--color-border);
        transition: left .3s;

        .mobile-visible & {
            left: 0;
            transition: left .1s;
        }
    }
}
`)}
Выражение ${pre(`@media (max-width: 700px)`)} означает, что правила внутри него будут применяться только когда максимальная ширина страницы 700px, то есть для любой ширины меньше 700px.


${pre('.mobile-visible')} — класс на элементе ${pre('html')}(${pre('document.documentElement')}).
Когда класс есть, меню отображается.
Для ширины экрана больше 700px меню отображается всегда, так как правило выше определено уже внутри медиа запроса.


Скрытие достигается помещением меню за левый край экрана.
Это позволяет анимировать появление и скрытие меню, меняя свойство left и выставляя transition.


Кнопка, показывающая меню, просто переключает класс ${pre('.mobile-visible')}
${code.block().lang('javascript')(`
E.div.class(b('menu-toggle'))(
    Button.onClick(() => {
        document.documentElement.classList.toggle('mobile-visible');
    })(E.div.style('width: 1em; height: 1em;')(Icon.Bars))
)
`)}
Сама кнопка становится видимой только при ширине странице меньше 700px
${code.block().lang('less')(`
&__menu-toggle {
    display: none;

    & > * {
        height: 100%;
    }

    @media (max-width: 700px) {
        display: block;
    }
}
`)}
Для того, чтобы работал клик на область вне меню, на слой уровнем ниже я поместил элемент, который растягивается на всю страницу и ловит все клики мимо меню.
Появляется он при тех же условиях, что и само меню
${code.block().lang('less')(`
&__menu-close-area {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 899;
    display: none;
    background-color: rgba(0,0,0,.5);

    @media (max-width: 700px) {
        .mobile-visible & {
            display: block;
        }
    }
}
`)}
Клик просто переключает класс
${code.block().lang('javascript')(`
E.div.class(b('menu-close-area'))
    .onClick(() => document.documentElement
        .classList.toggle('mobile-visible')
    )
`)}
Для удобства была также добавлена кнопка свертывания меню
${code.block().lang('javascript')(`
E.div.class(b('collapse-menu'))(Button.onClick(() => {
    document.documentElement.classList.toggle('mobile-visible');
})('свернуть меню')),
`)}
которая также появляется только на маленьких экранах
${code.block().lang('less')(`
&__collapse-menu {
    display: none;
    margin: 4px;
    padding: 4px;
    position: sticky;
    bottom: 1em;

    @media (max-width: 700px) {
        display: block;
    }
}
`)}

Дополнительно для маленьких экранов я уменьшаю заголовок, но немного другим способом
${code.block().lang('less')(`
h1 {
    font-size: 2em;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 50em) {
        font-size: 4vw;
    }

    @media (max-width: 25em) {
        font-size: 1em;
    }
}
`)}
При уменьшении ширина экрана он тоже уменьшается, но в границах от 2em до 1em.
Значение 4vw было подобрано опытным путём.
Чтобы переход был плавный, применяется он только в интервале ширины страницы от 25em(1em = 4vw) до 50em(2em = 4vw).
`;
}
