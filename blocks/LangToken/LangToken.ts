import { Component, E } from '../../utils';

import { token as f } from '../../services/langs/model';

const listeners = new Map();

export const Lang = Component.LangToken<
    { token: string; view: (name?: string) => any },
    { count: number }
>(({ props, state }) => {
    state.init({ count: 0 });

    if (listeners.has(props().token)) {
        window.removeEventListener('update-lang', listeners.get(props().token));
    }

    listeners.set(
        props().token,
        window.addEventListener('update-lang', () => {
            state.set({ count: state().count++ });
        })
    );

    return () => {
        const { token, view = (e) => E.span(e) } = props();
        return view(f(token));
    };
});
