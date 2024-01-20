import { token as f } from "../../services/langs/model";
import { Component, TemplateTree, isElementTemplate } from "parvis";

const listeners = new Map();

export const Lang = Component<{
    token: string;
    view?: (name?: string) => TemplateTree;
}>("LangToken", ({ props, state }) => {
    const [count, setCount] = state(0);

    if (listeners.has(props().token)) {
        window.removeEventListener("update-lang", listeners.get(props().token));
    }

    listeners.set(
        props().token,
        window.addEventListener("update-lang", () => {
            setCount((x) => x + 1);
        })
    );

    return () => {
        const { token, view = (e) => <span>{e}</span> } = props();
        const elem = view(f(token));
        if (isElementTemplate(elem)) return elem;
        return <span>{elem}</span>;
    };
});
