import { Component } from "parvis";
import { RouteLink, block } from "../../../utils";

import "./ColorFunction.less";
import { Breadcrumbs } from "../../../components";
import { Button, Collapse, Lang, Tooltip } from "../../../blocks";
import { ColorFnField } from "./ColorFnField";

const b = block("color-function");

const mathWords: string[] = Reflect.ownKeys(Math).filter(
    (key) => typeof key === "string"
) as string[];
const mathWordRegex = new RegExp(mathWords.join("|"), "g");

export const ColorFunction = Component("ColorFunction", ({ state }) => {
    const [getMax, setMax] = state(1);
    const [getMin, setMin] = state(-1);

    const [getXMax, setXMax] = state(100);
    const [getXMin, setXMin] = state(0);

    const [getYMax, setYMax] = state(100);
    const [getYMin, setYMin] = state(0);

    const [getWidth, setWidth] = state(500);
    const [getHeight, setHeight] = state(500);

    const [getRes, setRes] = state(100);
    const getResolutions = () => {
        const res = getRes();
        const w = getWidth();
        const h = getHeight();
        const ratio = Math.max(w, h) / Math.min(w, h);
        const mres = Math.trunc(res * ratio);
        const x = w > h ? mres : res;
        const y = w > h ? res : mres;
        return { y, x };
    };

    const [getFnText, setFnText] = state(
        "(sin(x/(4 + 2*t)) * sin(y/(9 - 2*t))) - (sin(x/10 + 3*t) + sin(y/12 - 3*t))"
    );

    const [getT, setT] = state(0);
    const [getPeriod, setPeriod] = state(7);
    const [getStep, setStep] = state(0.1);
    const [getPercent, setPercent] = state(0);

    // actions
    const play = (startTime = Date.now()) => {
        const now = Date.now();
        const period = getPeriod() * 1000;
        const diff = now - startTime;
        if (diff >= period) {
            setT(0);
            setPercent(0);
            return;
        }
        setT((t) => Math.trunc((t + getStep()) * 1000) / 1000);
        setPercent(Math.ceil((diff / period) * 100));
        window.requestAnimationFrame(() => play(startTime));
    };

    const [getPresetName, setPresetName] = state("");

    const storageKey = "color-fn-presets";
    const getPresets = () =>
        JSON.parse(localStorage.getItem(storageKey) ?? "{}") as Record<
            string,
            any
        >;
    const savePresets = (presets: any) =>
        localStorage.setItem(storageKey, JSON.stringify(presets));

    const savePreset = (name: string) => {
        const preset = {
            width: getWidth(),
            height: getHeight(),
            max: getMax(),
            min: getMin(),
            xmax: getXMax(),
            xmin: getXMin(),
            ymax: getYMax(),
            ymin: getYMin(),
            res: getRes(),
            fn: getFnText(),
            period: getPeriod(),
            step: getStep(),
        };

        const presets = getPresets();
        presets[name] = preset;

        savePresets(presets);
        setPresetName("");
    };

    const restoreFromPreset = (name: string) => {
        const preset = getPresets()[name];
        setWidth(preset.width);
        setHeight(preset.height);
        setMax(preset.max);
        setMin(preset.min);
        setXMax(preset.xmax);
        setXMin(preset.xmin);
        setYMax(preset.ymax);
        setYMin(preset.ymin);
        setRes(preset.res);
        setFnText(preset.fn);
        setPeriod(preset.period);
        setStep(preset.step);
    };

    const removePreset = (name: string) => {
        const presets = getPresets();
        delete presets[name];
        savePresets(presets);
        setPresetName("");
    };

    const getFn = () => {
        const text = getFnText();
        const t = getT();
        const currentText = text
            .replace(/t/g, `${t}`)
            .replace(mathWordRegex, (v) => `Math.${v}`);
        return eval(`(x, y) => (${currentText})`);
    };

    return () => {
        const resolutions = getResolutions();
        const presets = getPresets();
        const presetList = Object.keys(presets);
        const presetCount = presetList.length;
        return (
            <div>
                <Breadcrumbs
                    items={[
                        [<Lang token={`menu/projects`} />, "projects"],
                        ["Цветная функция"],
                    ]}
                />
                <div class={b()}>
                    <div>
                        <h2>
                            Цветная функция (
                            <RouteLink href="blog/23">Описание</RouteLink>)
                        </h2>
                        <div
                            class={b("container")}
                            style={`--width: ${getWidth()}px`}
                        >
                            <div class={b("settings")}>
                                <div class={b("param")}>
                                    function
                                    <textarea
                                        spellcheck="false"
                                        on:change={(e) =>
                                            setFnText(e.target.value)
                                        }
                                    >
                                        {`${getFnText()}`}
                                    </textarea>
                                </div>
                                <div class={b("pair")}>
                                    <div class={b("param")}>
                                        width
                                        <input
                                            type={"text"}
                                            value={getWidth()}
                                            on:change={(e) =>
                                                setWidth(Number(e.target.value))
                                            }
                                        />
                                    </div>

                                    <div class={b("param")}>
                                        height
                                        <input
                                            type={"text"}
                                            value={getHeight()}
                                            on:change={(e) =>
                                                setHeight(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div class={b("pair")}>
                                    <div class={b("param")}>
                                        min
                                        <input
                                            type={"text"}
                                            value={getMin()}
                                            on:change={(e) =>
                                                setMin(Number(e.target.value))
                                            }
                                        />
                                    </div>
                                    <div class={b("param")}>
                                        max
                                        <input
                                            type={"text"}
                                            value={getMax()}
                                            on:change={(e) =>
                                                setMax(Number(e.target.value))
                                            }
                                        />
                                    </div>
                                </div>
                                <div class={b("pair")}>
                                    <div class={b("param")}>
                                        X min
                                        <input
                                            type={"text"}
                                            value={getXMin()}
                                            on:change={(e) =>
                                                setXMin(Number(e.target.value))
                                            }
                                        />
                                    </div>
                                    <div class={b("param")}>
                                        X max
                                        <input
                                            type={"text"}
                                            value={getXMax()}
                                            on:change={(e) =>
                                                setXMax(Number(e.target.value))
                                            }
                                        />
                                    </div>
                                </div>
                                <div class={b("pair")}>
                                    <div class={b("param")}>
                                        Y min
                                        <input
                                            type={"text"}
                                            value={getYMin()}
                                            on:change={(e) =>
                                                setYMin(Number(e.target.value))
                                            }
                                        />
                                    </div>
                                    <div class={b("param")}>
                                        Y max
                                        <input
                                            type={"text"}
                                            value={getYMax()}
                                            on:change={(e) =>
                                                setYMax(Number(e.target.value))
                                            }
                                        />
                                    </div>
                                </div>
                                <div class={b("param")}>
                                    resolution
                                    <input
                                        type={"range"}
                                        min={1}
                                        max={200}
                                        value={getRes()}
                                        on:change={(e) =>
                                            setRes(Number(e.target.value))
                                        }
                                    />
                                </div>
                                X {resolutions.x}, Y {resolutions.y}
                                <div class={b("pair")}>
                                    <div class={b("param")}>
                                        period (s)
                                        <input
                                            type={"text"}
                                            value={getPeriod()}
                                            on:change={(e) =>
                                                setPeriod(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </div>
                                    <div class={b("param")}>
                                        step
                                        <input
                                            type={"text"}
                                            value={getStep()}
                                            on:change={(e) =>
                                                setStep(Number(e.target.value))
                                            }
                                        />
                                    </div>
                                </div>
                                <Button on:click={() => play()}>Play</Button>
                                <div class={b("param")}>
                                    <span>t: {getT()}</span>
                                    <progress value={getPercent()} max={100} />
                                </div>
                                <div class={b("pair")}>
                                    <input
                                        type="text"
                                        placeholder={"preset name"}
                                        value={getPresetName()}
                                        on:change={(e) =>
                                            setPresetName(e.target.value)
                                        }
                                    />
                                    <Button
                                        on:click={() => {
                                            savePreset(getPresetName());
                                        }}
                                        disabled={getPresetName().length === 0}
                                    >
                                        Save preset
                                    </Button>
                                </div>
                                {presetCount > 0 && (
                                    <Collapse
                                        title={`Saved presets (${presetCount})`}
                                    >
                                        {presetList.map((presetName) => {
                                            return (
                                                <div
                                                    class={b("param")}
                                                    style="margin-top: 0.5rem"
                                                >
                                                    <Tooltip
                                                        text={
                                                            <pre>
                                                                {JSON.stringify(
                                                                    presets[
                                                                        presetName
                                                                    ],
                                                                    null,
                                                                    2
                                                                )}
                                                            </pre>
                                                        }
                                                    >
                                                        {presetName}
                                                    </Tooltip>
                                                    <div style="display: flex; gap: 4px">
                                                        <Button
                                                            on:click={() =>
                                                                restoreFromPreset(
                                                                    presetName
                                                                )
                                                            }
                                                        >
                                                            set
                                                        </Button>
                                                        <Button
                                                            on:click={() =>
                                                                removePreset(
                                                                    presetName
                                                                )
                                                            }
                                                        >
                                                            remove
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </Collapse>
                                )}
                            </div>
                            <div class={b("fn-view")}>
                                <div class={b("y-axis")}>
                                    <div>Y↑ {getYMin()}</div>
                                    <div>{getYMax()}</div>
                                </div>
                                <ColorFnField
                                    size={{ x: getWidth(), y: getHeight() }}
                                    resolution={resolutions}
                                    x={{ min: getXMin(), max: getXMax() }}
                                    y={{ min: getYMin(), max: getYMax() }}
                                    value={{ min: getMin(), max: getMax() }}
                                    fn={getFn()}
                                />
                                <div></div>
                                <div class={b("x-axis")}>
                                    <div>
                                        {getXMin()}
                                        <br />
                                        X→
                                    </div>
                                    <div>{getXMax()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
});
