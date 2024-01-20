import "./StandardModel.less";

import { block } from "../../../utils";

import { Breadcrumbs } from "../../../components";
import { Lang } from "../../../blocks";
import { Component, StateClass } from "parvis";
import { Particle, particles } from "./data";

const b = block("standard-model");

const StandardModel = Component("StandardModel", ({ state }) => {
    const [interaction, setInteraction] = state(null) as StateClass<
        "electromagnetic" | "mass" | "weak" | "strong" | null
    >;
    const [I, setI] = state(null) as StateClass<number | null>;

    function renderTile(
        {
            name,
            symbol,
            charge,
            spin,
            mass,
            category,
            modifier,
            group,
            interaction,
        } = {} as Partial<Particle>,
        i: number,
        view = false
    ) {
        const current = I();
        const onItemClick = (e: any) => {
            const { interaction, i, view } = e.currentTarget.closest(
                "." + b("tile")
            ).firstChild.dataset;
            if (+view) {
                return;
            }
            if (interaction) {
                setInteraction(I() === +i ? null : interaction);
            } else {
                setInteraction(null);
            }
            setI((j) => (+i === j ? null : +i));
        };
        return (
            <div
                class={b("tile", {
                    mode: modifier ?? "",
                    interaction: interaction ?? "",
                })}
            >
                <div
                    style={`display: grid; grid-template-rows: auto 1fr ${
                        view ? "auto" : "3em"
                    };cursor: pointer`}
                    data-interaction={interaction}
                    data-i={i}
                    data-view={view ? 1 : 0}
                    class={current === i ? b("current") : ""}
                    on:click={onItemClick}
                >
                    <div style={`display:grid;grid-template-columns: 1fr auto`}>
                        <div style={`font-size: ${view ? "1" : ".8"}em;`}>
                            {view && "масса: "}
                            {mass}
                        </div>
                    </div>
                    <div
                        style={
                            view
                                ? ""
                                : `display:grid;grid-template-columns: auto 1fr`
                        }
                    >
                        <div style={`font-size: ${view ? "1" : ".8"}em;`}>
                            <div>
                                {view && "спин: "}
                                {spin}
                            </div>
                            <div>
                                {view && "заряд: "}
                                <span
                                    class={b("charge", {
                                        minus: !!charge?.startsWith("-"),
                                        plus: !!charge?.startsWith("+"),
                                    })}
                                >
                                    {charge}
                                </span>
                            </div>
                            {group && (
                                <div>
                                    {view && "группа симметрии: "}
                                    {group}
                                </div>
                            )}
                            {view && interaction && interaction !== "mass" && (
                                <div>
                                    Переносчик{" "}
                                    {
                                        {
                                            strong: "сильного",
                                            electromagnetic:
                                                "электромагнитного",
                                            weak: "слабого",
                                        }[interaction]
                                    }{" "}
                                    взаимодействия
                                </div>
                            )}
                        </div>
                        <div
                            style={`font-size: ${
                                view ? 5 : 3
                            }em;font-weight: 100;font-family:serif; display:flex; justify-content: center; align-items: center;margin-right: .3em; padding: .5em 0 .2em 0;${
                                view ? "margin-top: .1em;" : ""
                            }`}
                        >
                            <div class={b("symbol")}>{symbol}</div>
                        </div>
                    </div>
                    <div
                        style={`font-size: 1em;  display:flex; justify-content: center; align-items: center; text-align: center;  line-height: 1.1em; ${
                            view ? "padding-bottom: 1em;" : ""
                        }`}
                    >
                        <div>
                            <div
                                style={
                                    view
                                        ? "font-size: 1.5em; line-height: 1.5em;"
                                        : ""
                                }
                            >
                                {name}
                                {view && category === "quark" && " кварк"}
                                {view &&
                                    category === "anti-quark" &&
                                    " антикварк"}
                            </div>
                            {category === "quark" && (
                                <div class={b("colors")}>
                                    {view && ["цветовой заряд:  ", <br />]}
                                    {["red", "green", "blue"].map((color) => (
                                        <div
                                            class={b("color", {
                                                [color]: true,
                                            })}
                                        />
                                    ))}
                                </div>
                            )}
                            {category === "anti-quark" && (
                                <div class={b("colors")}>
                                    {view && ["цветовой заряд: ", <br />]}
                                    {["antired", "antigreen", "antiblue"].map(
                                        (color) => (
                                            <div
                                                class={b("color", {
                                                    [color]: true,
                                                })}
                                            />
                                        )
                                    )}
                                </div>
                            )}
                            {name === "глюон" && (
                                <div class={b("colors")}>
                                    {view && ["цветовой заряд:  ", <br />]}
                                    {[
                                        "red-antiblue",
                                        "blue-antigreen",
                                        "green-antired",
                                        "red-antigreen",
                                        "blue-antired",
                                        "green-antiblue",
                                        "g3",
                                        "g8",
                                    ].map((color) => (
                                        <div
                                            class={b("color", {
                                                [color]: true,
                                                gluon: true,
                                            })}
                                        >
                                            {color === "g3"
                                                ? "3"
                                                : color === "g8"
                                                ? "8"
                                                : null}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return () => {
        return (
            <div>
                <Breadcrumbs
                    items={[
                        [<Lang token={`menu/physics`} />, "physics"],
                        [<Lang token={`tile/standart-model`} />],
                    ]}
                />
                <div class={b()}>
                    <h2>Стандартная модель элементарных частиц</h2>
                    <div class={b("table")}>
                        <div class={b("area", { fermions: true })}>
                            фермионы
                        </div>
                        <div class={b("area", { bosons: true })}>бозоны</div>
                        <div class={b("area", { anti: true })}>античастицы</div>
                        <div class={b("area", { normal: true })}>частицы</div>
                        <div class={b("area", { vector: true })}>векторные</div>
                        <div class={b("area", { scalar: true })}>скалярный</div>
                        <div class={b("area", { leptons: true })}>
                            <div
                                style={`display: flex; justify-content: flex-end; align-items: flex-end; height: 100%`}
                            >
                                лептоны
                            </div>
                        </div>
                        <div class={b("area", { quarks: true })}>
                            <div
                                style={`display: flex; justify-content: flex-end; align-items: flex-start; height: 100%`}
                            >
                                кварки
                            </div>
                        </div>
                        {interaction() === "weak" && [
                            <div class={b("weak", { part: 1 })} />,
                            <div class={b("weak", { part: 2 })} />,
                        ]}
                        {interaction() === "electromagnetic" && [
                            <div class={b("electromagnetic", { part: 1 })} />,
                            <div class={b("electromagnetic", { part: 2 })} />,
                            <div class={b("electromagnetic", { part: 3 })} />,
                        ]}
                        {interaction() === "strong" && [
                            <div class={b("strong", { part: 1 })} />,
                            <div class={b("strong", { part: 2 })} />,
                        ]}
                        {interaction() === "mass" && [
                            <div class={b("higgs", { part: 1 })} />,
                            <div class={b("higgs", { part: 2 })} />,
                        ]}
                        {particles.map((e, i) => renderTile(e, i))}
                        <div class={b("border", { ["anti-normal"]: true })} />
                        <div
                            class={b("border", { ["fermions-bosons"]: true })}
                        />
                        <div
                            class={b("border", { ["leptons-quarks"]: true })}
                        />
                        <div class={b("border", { ["vector-scalar"]: true })} />

                        {[1, 2, 3, 1, 2, 3].map((k, i) => (
                            <div class={b("generation", { start: i === 0 })}>
                                {k}
                            </div>
                        ))}
                        <div style={`grid-column: 2 / 8; text-align: center`}>
                            Поколения
                        </div>
                        {I() !== null && (
                            <div class={b("big-tile")}>
                                {renderTile(
                                    particles[I() ?? 0],
                                    I() ?? 0,
                                    true
                                )}
                            </div>
                        )}
                    </div>
                    <p>
                        Взаимодействия:
                        <span class={b("interaction", { type: "strong" })}>
                            сильное
                        </span>
                        ,{" "}
                        <span
                            class={b("interaction", {
                                type: "electromagnetic",
                            })}
                        >
                            электромагнитное
                        </span>{" "}
                        и{" "}
                        <span class={b("interaction", { type: "weak" })}>
                            слабое
                        </span>
                        . Также добавлено{" "}
                        <span class={b("higgs-field")}>поле Хиггса</span>. При
                        нажатии на карточки частиц бозонов — квантов
                        соответствующих полей, будут подсвечены все частицы, на
                        которые действует поле. Значения масс для частиц взяты
                        со страницы{" "}
                        <a
                            href={
                                "https://en.wikipedia.org/wiki/Standard_Model"
                            }
                        >
                            Стандартной модели
                        </a>{" "}
                        в википедии. Выделение антинейтрино как отдельных частиц
                        в таблице не значит, что они являются фермионами Дирака,
                        а сделано исключительно для визуального удобства.
                    </p>
                </div>
            </div>
        );
    };
});

export default StandardModel;
