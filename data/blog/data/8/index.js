export default (api) => {
    const {book, text, block, external} = api;
    const {code, h} = text;
    const {pre} = block;
    return book`
После долгого летнего перерыва возвращаюсь к ведению блога.
Прежде всего мне надо было обновить движок, сделав нормальные компоненты.
Теперь компоненты могут обновлять ${code('props')}, не меняя ${code('state')}.
Можно писать обертки, плюс это шаг в сторону поддержки аналога контекста из React.


${h(3)('Что поменялось')}
Так как теперь свойства компонента могут меняться, они стали вычисляться аналогично состоянию, посредством вызова функции.


Было:
${pre(`
const Hello = Component.Hello(({props}) => {
    return () => {
        const {name} = props;
        return E.div(\`Hello, \${name}\`);
    };
})
`)}

Стало:
${pre(`
const Hello = Component.Hello(({props}) => {
    return () => {
        const {name} = props();
        return E.div(\`Hello, \${name}\`);
    };
})
`)}

${h(3)('В действии')}
Давайте возьмём компонент ${code('Hello')}, определенный только что выше, и обернем его в компонент, который будет менять ему имя.

${pre(`
const HelloBox = Component.HelloBox(({state}) => {
    state.init({name: 'Alex'});

    return () => {
        const {name} = state();
        return E.div(
            Hello.name(name),
            E.button.onClick(() => state.set({name: prompt('new name') || '—'}))(
                'Set new name'
            )
        );
    };
})
`)}

${external(({E, Component}) => {
    const Hello = Component.Hello(({props}) => {
        return () => {
            const {name} = props();
            return E.div(`Hello, ${name}`);
        };
    });
    const HelloBox = Component.HelloBox(({state}) => {
        state.init({name: 'Alex'});

        return () => {
            const {name} = state();
            return E.div(
                Hello.name(name),
                E.button.onClick(() => state.set({name: prompt('new name') || '—'}))(
                    'Set new name'
                )
            );
        };
    });

    return E.div.style`padding: 8px; border: 1px solid var(--color-border)`(HelloBox);
})}

${h(3)('Как это работает')}
У каждого элемента в дереве отслеживаются компоненты, которые являются ему потомками, и до них можно добраться по цепочке элементов.
Вглубь компонента разбор не смотрит, внутреннее дерево компонента разбирается уже внутри него самого.
Когда компонент в рендер функции возвращает дерево при смене состояния, сравниваются пути до вложенных компонентов.


Путь имеет вид ${code('[tag].[key]>...>[tag].[key]#[name]')}, где tag — название html тега, key — ключ элемента(если он не указан, то порядковый номер элемента в списке дочерних узлов), name — имя компонента.
Например, ${code('div.1>div.0#Hello')}.
Будем считать, что такой путь полностью определяет место компонента в дереве.
В будущем это место стоит продумать лучше.


Итак, если пути до компонентов совпадают и свойства поменялись, передаём обновление в руки этого вложенного компонента.
Компонент верхнего уровня просто пропускает обновление реального dom в этом месте.
Вложенный компонент перерендерит себя с новыми свойствами, не меняя состояние.
`;
}
