import { Component } from "parvis";


export const QCD = Component('QCD', ({ hooks }) => {
    hooks.mount(() => {
        import('./glsl');
    })
    return () => {
        return <div>
            <h2>
                Визуализация квантовой хромодинамики
            </h2>
            <canvas id="glCanvas"></canvas>
            <canvas id="expCanvas" height={300} width={600}></canvas>
            <canvas id="expCanvas2" height={300} width={500}></canvas>
        </div>
    }
})