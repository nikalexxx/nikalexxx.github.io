const elementStructure = (T: any) => ({
    nodeType: T(Number),
    namespace: T(String),
    tagName: T(String),
    props: T`?`({
        [T(String)]: T(String),
    }),
    children: T`?`(Object)(T(elementStructure)),
    subComponents: {
        [T(String)]: T(Function),
    },
    data: T(String),
});

const diffStructure = (t: any) => ({
    nodeType: t`?`(Number), // перезаписывает тип узла
    namespace: t`?`(String), // новое пространство имён
    tagName: t`?`(String), // новый тег
    props: t`?`({
        [t(String)]: [t(String), t(null)], // переписать свойство, добавить, если нет, если null - удалить
    }),
    children: t`?`(Object)(t(diffStructure)), // рекурсивно повторить для потомков, лишние удалить, недостающие добавить, в будущем сопоставлять по ключу
    data: t`?`(String), // поменять текстовый узел
    delete: t`?`(true), // удалить элемент
});

const diffFunctionStructure = (t: any) =>
    t(Function)(({ params }: any) =>
        t({
            params: {
                A: t(elementStructure), // старый элемент
                B: t(elementStructure), // новый элемент
            },
        })(t(diffStructure))
    );
