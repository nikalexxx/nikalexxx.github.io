import "./Unicode.less";

import { block } from "../../../utils";

import { Breadcrumbs } from "../../../components";
import { Button, Lang } from "../../../blocks";
import { Component } from "parvis";

const b = block("unicode");

const knownSets = [
    "ASCII",
    "ASCII_Hex_Digit",
    "Alphabetic",
    // "Any",
    // "Assigned",
    // "Bidi_Control",
    // "Bidi_Mirrored",
    "Case_Ignorable",
    // "Cased",
    // "Changes_When_Casefolded",
    // "Changes_When_Casemapped",
    // "Changes_When_Lowercased",
    // "Changes_When_NFKC_Casefolded",
    // "Changes_When_Titlecased",
    // "Changes_When_Uppercased",
    "Dash",
    "Default_Ignorable_Code_Point",
    "Deprecated",
    "Diacritic",
    "Emoji",
    "Emoji_Component",
    "Emoji_Modifier",
    "Emoji_Modifier_Base",
    "Emoji_Presentation",
    "Extended_Pictographic",
    "Extender",
    // "Grapheme_Base",
    "Grapheme_Extend",
    "Hex_Digit",
    "IDS_Binary_Operator",
    "IDS_Trinary_Operator",
    // "ID_Continue",
    // "ID_Start",
    "Ideographic",
    "Join_Control",
    "Logical_Order_Exception",
    "Lowercase",
    "Math",
    "Noncharacter_Code_Point",
    // "Pattern_Syntax",
    // "Pattern_White_Space",
    "Quotation_Mark",
    "Radical",
    "Regional_Indicator",
    "Sentence_Terminal",
    "Soft_Dotted",
    "Terminal_Punctuation",
    "Unified_Ideograph",
    "Uppercase",
    "Variation_Selector",
    "White_Space",
    // "XID_Continue",
    // "XID_Start",
];

const getColor = (i: number) =>
    `hsl(${Math.floor((360 / knownSets.length) * i)} 80% 40% / 0.1)`;
const getGradient = (list: number[]) => {
    const n = list.length;
    const p = 100 / n;
    return `linear-gradient( to left, ${list
        .map((i, j) => {
            const color = getColor(i);
            return `${color} ${Math.floor(p * j)}%, ${color} ${Math.floor(
                p * (j + 1)
            )}%`;
        })
        .join(", ")})`;
};

const regexList = knownSets.map((name) => new RegExp(`\\p{${name}}`, "u"));

const uarea = 65535;
const limit = uarea;
const max = 1112064;
const count = (max - (max % limit)) / limit + 1;

function getUnicodeList(start: number, end: number) {
    const table = [];
    for (let i = start; i < end; i++) {
        const letter = String.fromCodePoint(i);
        let sets: number[] = [];
        for (let j = 0; j < knownSets.length; j++) {
            if (regexList[j].test(letter)) sets.push(j);
        }
        const unicodeSets = sets.map((i) => knownSets[i]).join(",");
        table.push(
            <div
                title={`${i}: ${unicodeSets || "—"}`}
                style={
                    sets.length > 0
                        ? `background: ${getGradient(sets)}`
                        : undefined
                }
                data-unicode-sets={unicodeSets}
            >
                <div>{letter}</div>
                <span>{i}</span>
            </div>
        );
    }
    return table;
}

const Unicode = Component("Unicode", ({ state }) => {
    const [i, setI] = state(0);

    return () => {
        const start = i();
        const startI = start * limit;
        const end = start * limit + limit;
        const endI = end > max ? max : end;
        return (
            <div>
                <Breadcrumbs
                    items={[
                        [<Lang token={`menu/projects`} />, "projects"],
                        ["Юникод"],
                    ]}
                />
                <div class={b()}>
                    <div>
                        <h2>Юникод</h2>
                        <p>
                            Цвет показывает принадлежность к некому подмножеству
                            юникода, например к математическим символам или
                            эмоджи. Полный список подмножеств виден при
                            наведении на символ.
                        </p>
                        <br />
                        <div>
                            Языковые плоскости{" "}
                            {[...new Array(count).keys()].map((i) => (
                                <div
                                    class={b("button-container")}
                                    on:click={() => setI(i)}
                                >
                                    <Button>
                                        <span
                                            class={b("button", {
                                                active: i === start,
                                            })}
                                        >
                                            {String(i + 1)}
                                        </span>
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <br />
                        <p>
                            Cимволы {startI} — {endI}
                        </p>
                        <br />

                        <div class={b("table")} _forceUpdate={true}>
                            {getUnicodeList(startI, endI)}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
});

export default Unicode;
