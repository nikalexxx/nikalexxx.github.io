import "./GameOfLife.less";

import { Button, Checkbox, Lang, Select } from "../../../blocks";
import { NOT, block } from "../../../utils";

import { Breadcrumbs } from "../../../components";
import { Icon } from "../../../icons/index.js";
import { Component } from "parvis";

const b = block("game-of-life");

const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
};

const patternGroups = {
    spaceship: "Космические корабли, скорость",
    puffer: "Паровозы, скорость",
    gun: "Ружья",
    oscillator: "Осцилляторы, период",
    methuselah: "Долгожители",
};

const patterns: Record<string, { name: string; code: string; group: string }> =
    {
        glider: {
            name: "Планер, c/4",
            code: "bob$2bo$3o!",
            group: patternGroups.spaceship,
        },
        "lightweight-spaceship": {
            name: "Лёгкий космический корабль, c/2",
            code: "bo2bo$o4b$o3bo$4o!",
            group: patternGroups.spaceship,
        },
        "middleweight-spaceship": {
            name: "Средний космический корабль, c/2",
            code: "3bo2b$bo3bo$o5b$o4bo$5o!",
            group: patternGroups.spaceship,
        },
        "heavyweight-spaceship": {
            name: "Тяжёлый космический корабль, c/2",
            code: "3b2o2b$bo4bo$o6b$o5bo$6o!",
            group: patternGroups.spaceship,
        },
        swan: {
            name: "Лебедь, c/4",
            code: `bo10b2o10b$5o6b2o11b$o2b2o8bo7b2ob$2b2obo5b2o6b3obo$11b2o3bob2o4b$5bob
        o6b2o8b$10b3obo4bo4b$7b3o3bo4bo5b$8bo7bo7b$8bo6bo8b2$11bo!`,
            group: patternGroups.spaceship,
        },
        loafer: {
            name: "Бездельник, c/7",
            code: `b2o2bob2o$o2bo2b2o$bobo$2bo$8bo$6b3o$5bo$6bo$7b2o!`,
            group: patternGroups.spaceship,
        },
        lobster: {
            name: "Омар, c/7",
            code: `12b3o$12bo$13bo2b2o$16b2o$12b2o$13b2o$12bo2bo2$14bo2bo$14bo3bo$15b3obo
        $20bo$2o2bobo13bo$obob2o13bo$o4bo2b2o13b2o$6bo3bo6b2o2b2o2bo$2b2o6bo6b
        o2bo$2b2o4bobo4b2o$9bo5bo3bo3bo$10bo2bo4b2o$11b2o3bo5bobo$15bo8b2o$15b
        o4bo$14bo3bo$14bo5b2o$15bo5bo!`,
            group: patternGroups.spaceship,
        },
        weekender: {
            name: "Отдыхающий, 2c/7",
            code: `bo12bob$bo12bob$obo10bobo$bo12bob$bo12bob$2bo3b4o3bo2b$6b4o6b$2b4o4b4o
        2b2$4bo6bo4b$5b2o2b2o!`,
            group: patternGroups.spaceship,
        },
        "3-engine-cordership": {
            name: "Трёхмоторный эсминец, c/12",
            code: `31b3o24b$32bo25b$32bo2bo22b$32bo2bo22b$33bobo22b$48b2o8b$48b2o8b3$32bo
        25b$31bobo24b$32bo25b$49bo8b$48bo7b2o$30b4o22b2o$30b2o3bo10bo11b$31bo
        4bo9bobo9b$33bob2o10bo10b$34bo23b3$42bobob2o10b$25bo16bobo13b$24b3o17b
        o2bo10b$43bo3bo10b$24b3o16b4o2b2o7b$25b2ob2o14bo5b2o6b$27bo21bo8b3$b3o
        54b$2bo55b$2bo2bo52b$2bo2bo52b$3bobo52b$18b2o38b$18b2o38b$24bo33b$23b
        3o32b$2bo19b2ob2o31b$bobo18bobo33b$2bo19bo35b3$4o54b$2o3bo13bo38b$bo4b
        o11bobo37b$3bob2o11bo39b$4bo15b2o36b$21bo36b$18b3o37b$19b2o37b$16bo41b
        $16b2o40b$16b2o40b$6b2o6b2o42b$6b2o4b2o44b$12b2obo42b$14b2o42b5$14b2o
        42b$14b2o!`,
            group: patternGroups.spaceship,
        },
        "p15-pre-pulsar-spaceship": {
            name: "Допульсарный космический корабль(период 15), c/5",
            code: `3b3o10b3o23b3o10b3o3b$4bobo8bobo25bobo8bobo4b$6bo8bo29bo8bo6b$bob5o6b
        5obo19bob5o6b5obob$bob2o3b2o2b2o3b2obo19bob2o3b2o2b2o3b2obob$2o5b3o2b
        3o5b2o17b2o5b3o2b3o5b2o$5b2ob2o2b2ob2o27b2ob2o2b2ob2o5b2$4bo12bo25bo
        12bo4b$5b3o6b3o27b3o6b3o5b$4b4o6b4o25b4o6b4o4b$3b2o12b2o23b2o12b2o3b$
        4bo12bo25bo12bo4b$2b3o12b3o21b3o12b3o2b$2bo16bo21bo16bo2b$5bo10bo27bo
        10bo5b$3bobo10bobo23bobo10bobo3b$2bo3b2o6b2o3bo21bo3b2o6b2o3bo2b$3bo5b
        o2bo5bo23bo5bo2bo5bo3b$9bo2bo35bo2bo9b$bob2o4bo2bo4b2obo19bob2o4bo2bo
        4b2obob$bo3b3obo2bob3o3bo19bo3b3obo2bob3o3bob$2bo6bo2bo6bo21bo6bo2bo6b
        o2b$bo2b2o3bo2bo3b2o2bo19bo2b2o3bo2bo3b2o2bob$bo2b2obobo2bobob2o2bo19b
        o2b2obobo2bobob2o2bob$5bo2bo4bo2bo27bo2bo4bo2bo5b$6bobo4bobo29bobo4bob
        o6b$27bo5bo27b$4b2obob4obob2o9bo5bo9b2obob4obob2o4b$10b2o14bobo3bobo
        14b2o10b$2bob2o10b2obo7bo5bo7bob2o10b2obo2b$2o2bo3b2o2b2o3bo2b2o5bo5bo
        5b2o2bo3b2o2b2o3bo2b2o$b2obo12bob2o19b2obo12bob2ob$3b2obo8bob2o23b2obo
        8bob2o3b$4bo2bo6bo2bo25bo2bo6bo2bo4b$b2o2bo2bo4bo2bo2b2o4b2o7b2o4b2o2b
        o2bo4bo2bo2b2ob$bo5b2o4b2o5bo5bobo3bobo5bo5b2o4b2o5bob$b3o3bo6bo3b3o6b
        o5bo6b3o3bo6bo3b3ob$3b4o8b4o23b4o8b4o3b$4bo2bo6bo2bo25bo2bo6bo2bo4b$4b
        o12bo25bo12bo4b$4bob2o6b2obo25bob2o6b2obo4b$5bo10bo27bo10bo!`,
            group: patternGroups.spaceship,
        },
        "spaghetti-monster": {
            name: "Спагетти монстр, 3c/7",
            code: `8b3o5b3o$8bobo5bobo$8bobo5bobo$6bob2o3bo3b2obo$6b2o4bobo4b2o$10b2obob
        2o$9bo7bo$9bobo3bobo$5b5o7b5o$4bo2bo11bo2bo$5bob3o7b3obo$7bob2o5b2obo$
        6b2obobo3bobob2o$6b3obo5bob3o2$10b2o3b2o$12bobo$9bo7bo$9b2o5b2o$6b2o
        11b2o$4bob2o11b2obo$4b2o2b2o7b2o2b2o$4bo2bo2bo5bo2bo2bo$5bo4bo5bo4bo$
        5bo2bo2bo3bo2bo2bo$2bo5bo9bo5bo$3bobo15bobo$7bo11bo$3bo3bobo7bobo3bo$
        3bo2bo3bo5bo3bo2bo$4b2o2b2o7b2o2b2o$8bo9bo2$8b5ob5o$bo6b2ob2ob2ob2o6bo
        $3o7bo5bo7b3o$o2b2o5bo5bo5b2o2bo$2bo3b5o5b5o3bo$7bob2o5b2obo$bo3bo15bo
        3bo$bob2o2bo11bo2b2obo$bob4o13b4obo$4bo17bo2$2bo21bo$bobo19bobo$o25bo$
        o3bo17bo3bo$5bo15bo$2o23b2o$2bo3bo2bo7bo2bo3bo$2bo3bobobo5bobobo3bo$2b
        o5bob2o3b2obo5bo$2bo3b2obo7bob2o3bo$6b2o11b2o$4bo17bo$3bo19bo$3bo4bo9b
        o4bo$2b2o3b2o9b2o3b2o$2b2o3bobo7bobo3b2o$2b2o3b2o3b3o3b2o3b2o$2b3o2b3o
        bo3bob3o2b3o$6bob2obo3bob2obo$2b2o3b2obo5bob2o3b2o$3bob2o3bobobobo3b2o
        bo$11bobobo$8bo9bo$8b3o5b3o$10b2obob2o$10b7o$8b3o5b3o$7b2obobobobob2o$
        6bo3bo5bo3bo$11b2ob2o$5bo2bobobobobobo2bo$6b4o7b4o$9bo7bo$9bo7bo$6b2ob
        o2bobo2bob2o2$9b2o5b2o3$9bo7bo$9b3o3b3o$8bo2bo3bo2bo$9bo7bo$8bo2bo3bo
        2bo$11b2ob2o$12bobo$10bobobobo$9bo3bo3bo$9bo7bo$12bobo$7b2obo5bob2o$7b
        2o2bo3bo2b2o$7bo11bo$8bo9bo$6bobo9bobo$5b4o9b4o$5b2obobo5bobob2o$4bo2b
        o11bo2bo$9bobo3bobo$8b2obo3bob2o$4bo2bo3b2ob2o3bo2bo$9bo2bobo2bo$6bo2b
        ob2ob2obo2bo$7bobobobobobobo$8b2o2bobo2b2o$9bobo3bobo$10b2o3b2o$7b2o9b
        2o$7b3o7b3o$7bobo7bobo$5b2o2bo7bo2b2o$5b2o13b2o$11bo3bo$6bo4bo3bo4bo$
        6b2o3bo3bo3b2o$7bo2bo5bo2bo$7b3o7b3o$6bobo9bobo$6b2o11b2o$6bobo4bo4bob
        o$6b2o4b3o4b2o$6b2o3bo3bo3b2o$5b3o4b3o4b3o$3b2o17b2o$2bo5b2o2bobo2b2o
        5bo2$2bo2bob3ob2ob2ob3obo2bo$8b3o5b3o$10b3ob3o$5bo4b2obob2o4bo$11bo3bo
        2$11b2ob2o!`,
            group: patternGroups.spaceship,
        },
        "puffer-1": {
            name: "Паровоз 1, c/2",
            code: `b3o6bo5bo6b3ob$o2bo5b3o3b3o5bo2bo$3bo4b2obo3bob2o4bo3b$3bo19bo3b$3bo2b
        o13bo2bo3b$3bo2b2o11b2o2bo3b$2bo3b2o11b2o3bo!`,
            group: patternGroups.puffer,
        },
        "puffer-2": {
            name: "Паровоз 2, c/2",
            code: `78bo26b$76b2o27b$77b2o26b2$69bobo33b$69b2o34b$70bo34b2$12bo92b$10bobo
        29b2o28b2o31b$11b2o29b2o28b2o31b$8b2o95b$7bobo95b$9bo95b2$80b2o23b$57b
        3o9b2o9bobo4b3o11b3ob$57bo2bo8bobo8bo6bo2bo10bo2bo$57bo11bo17bo6b3o4bo
        3b$57bo29bo5bo2bo4bo3b$58bobo27bobo2b2obo5bobo25$60bo44b$61b2o42b$60b
        2o43b3$4bobo98b$4b2o99b$5bo99b$34b2o28b2o39b$36bo29bo38b$2b2o29bo29bo
        41b$3b2o29b2o21b3o4b2o5b3o13b3o11b3ob$2bo54bo2bo10bo2bo12bo2bo10bo2bo$
        57bo13bo15bo6b3o4bo3b$5b2o50bo13bo15bo5bo2bo4bo3b$4b2o52bobo11bobo13bo
        bo2b2obo5bobo$6bo98b4$93bo11b$94bo10b14$55bo49b$56b2o47b$55b2o48b7$5bo
        99b$3bobo29b2o28b2o38b$4b2o29b2o28b2o38b$b2o102b$obo102b$2bo102b4$64bo
        40b$63b3o39b$63bob2o38b$64b3o38b$64b2o39b4$57b3o11b3o13b3o11b3ob$57bo
        2bo10bo2bo12bo2bo10bo2bo$57bo13bo15bo6b3o4bo3b$57bo13bo15bo5bo2bo4bo3b
        $58bobo11bobo13bobo2b2obo5bobo5$93bo11b$94bo!`,
            group: patternGroups.puffer,
        },
        "glider-train": {
            name: "Планерный поезд, c/2",
            code: `32b2o$31b2o$33bo17b6o6b2o$50bo5bo4bo4bo$56bo10bo$26b5o19bo4bo5bo5bo$
        25bo4bo21b2o8b6o$30bo$18b2o5bo3bo23bo$18b2o7bo24bobo$14b3o4bo29bo5bo$
        13bob2o5b2o11b2o15bobobobo6bo$b2o9b2obobo3b2o11bo2bo13b2o2bo3bo5b2o$o
        2bo9b6o9b2o4bobo7b2o5b2o3b2obo4bob2o$b2o11b4o10b2o5bo8b2o7bo5bo4bobo$
        50bobo11b2o2$50bobo11b2o$b2o11b4o10b2o5bo8b2o7bo5bo4bobo$o2bo9b6o9b2o
        4bobo7b2o5b2o3b2obo4bob2o$b2o9b2obobo3b2o11bo2bo13b2o2bo3bo5b2o$13bob
        2o5b2o11b2o15bobobobo6bo$14b3o4bo29bo5bo$18b2o7bo24bobo$18b2o5bo3bo23b
        o$30bo$25bo4bo21b2o8b6o$26b5o19bo4bo5bo5bo$56bo10bo$50bo5bo4bo4bo$33bo
        17b6o6b2o$31b2o$32b2o!`,
            group: patternGroups.puffer,
        },
        "space-rake": {
            name: "Космические грабли, с/2",
            code: `11b2o5b4o$9b2ob2o3bo3bo$9b4o8bo$10b2o5bo2bob2$8bo13b$7b2o8b2o3b$6bo9bo
        2bo2b$7b5o4bo2bo2b$8b4o3b2ob2o2b$11bo4b2o4b4$18b4o$o2bo13bo3bo$4bo16bo
        $o3bo12bo2bob$b4o!`,
            group: patternGroups.puffer,
        },
        "3-engine-cordership-rake": {
            name: "Грабли для трёхмоторного эсминца, c/2",
            code: `142b2o317b$126b2o13b2ob2o315b$125b4o13b4o315b$124b2ob2o14b2o316b$125b
        2o334b$147bo313b$146b3o312b$130bo11bo3b2obo311b$128b4o10bo6bo311b$127b
        ob5o14bo6bo305b$126b2o6bo18b2o306b$127b3obo3bo18b2o305b$128b3o3bo326b$
        133bo327b$160bo5b2o293b$126b2o30b2o5b2ob3o290b$125b4o4b4o22b2o5b5o290b
        $124b2ob2o4bo3bo3bo2bo22b3o291b$125b2o6bo6bo320b$134bo2bo2bo3bo20bo
        295b$140b4o9b2o8b2o296b$146b3o5b2o8b2o295b$146b2ob2o6b3o301b$146b3o5b
        2o305b$140b4o9b2o306b$140bo3bo316b$140bo320b$141bo2bo316b$159bo2bo298b
        $158bo302b$158bo3bo298b$100b2o56b4o299b$99b4o68bo289b$98b2ob2o68bo289b
        $82b2o15b2o58b3o3bo295b$81b2ob2o72b5o2bo7bo287b$82b4o71b2ob4obo7bo287b
        $83b2o73b2o301b$103bo357b$97b2o3b3o356b$85b3o9b3ob5o355b$84b2o3bo9b3o
        8bobo348b$83b2o2bobo9b3o8b2o46b4o299b$84bo5bo9bo10bo46bo3bo298b$85b2o
        2bo11bo56bo302b$89bo34b3o32bo2bo298b$87bo27bobo5b5o333b$91bo2bo20b2o5b
        2ob3o333b$82b2o6bo25bo6b2o336b$81b2ob2o4bo3bo366b$82b4o4b4o3b4o360b$
        83b2o12bo3bo9bo8bobo338b$97bo11b2o9b2o14bo324b$98bo2bo2b2o5b3o7bo12bo
        3bo322b$103b3o6b3o18bo327b$98bo2bo2b2o5b3o19bo4bo322b$97bo11b2o22b5o
        323b$97bo3bo9bo349b$97b4o360b2$115b2o344b$114b2ob2o342b$115b4o17b2o
        323b$116b2o17b3o323b$117bo18b2o323b$115bo3bo2b2o13bobo321b$114bo5bob2o
        14b2o321b$114bo5b4o337b$114b6o341b2$130b2o46bo2bo279b$129b2ob2o43bo
        283b$130b4o5b2o36bo3bo279b$131b2o5b2ob4o15b4o13b4o280b$139b6o15bo3bo
        296b$140b4o16bo300b$161bo2bo296b$181b3o277b$165bo10bobobo3bo276b$163b
        3o10bo7bo27bobo10bo235b$162bo3bo15b2o5bo22b2o9b2o236b$162bo4b3o19bobo
        21bo10b2o235b$162b2obob3o8bo10b2o270b$164bo3b2o34bo256b$165bobo34bo3bo
        254b$194bo6bo259b$194bobo4bo4bo254b$160b4o5b2o23b2o5b5o255b$160bo3bo3b
        2ob2o4b2o282b$160bo8b4o3b4o281b$161bo2bo5b2o3b2ob2o9bo9bo261b$176b2o
        11bo9bobo259b$182bobo4b2o2bo5b2o260b$181b2o2bo7bo267b$182bobo4b2o2bo
        267b$176b2o11bo271b$175b2ob2o9bo271b$176b4o281b$177b2o282b$68b2o125b2o
        264b$66bo4bo122b4o263b$65bo127b2ob2o263b$57bo2bo4bo5bo68bo2bo50b2o265b
        $56bo8b6o68bo64bo256b$56bo3bo78bo3bo59bobo255b$56b4o62b4o13b4o55b2o2b
        2ob3o6bo246b$42b4o76bo3bo66b12ob2o6bobo244b$41b7o4b2o68bo70bo7bo2bo9b
        2o245b$40b2ob3ob2o2bobo69bo2bo66bo6b2o3b2o254b$41b2o3b2o2bo2b2o93bo45b
        o266b$50bo2bo73b2o19bobo45b2o263b$44b2o4bobo72b5o18b2o311b$42bo8bo72bo
        4bo2b3obo63b2o259b$41bo82bo2b3o3bo3b2o60b4o258b$41bo3bo78b2o2bo7bobo
        14bo44b2ob2o258b$41b4o81b2o7b2obo14bobo10bo32b2o260b$25b2o109b2o15b2o
        9bo3bo292b$24b4o108bo26bo297b$23b2ob2o135bo4bo292b$24b2o5b2ob3o85b4o5b
        2o25bo4b5o293b$30bo5b2o84bo3bo3b2ob2o4b2o17bobo300b$29b2o7bo10bo72bo8b
        4o3b4o16b2o301b$30bo5b2o9bo2bo72bo2bo5b2o3b2ob2o9bo309b$24b2o5b2ob3o
        10b2o89b2o11bo11b2o296b$9bo2bo5b2o3b2ob2o116bobo4b2o2bo7b2o296b$8bo8b
        4o3b4o115b2o2bo7bo18b2o285b$8bo3bo3b2ob2o4b2o16b2o99bobo4b2o2bo17b2ob
        3o282b$8b4o5b2o24bobo3b5o84b2o11bo22b5o282b$43bo5bo4bo82b2ob2o9bo23b3o
        283b$49bo88b4o319b$50bo3bo21b2o61b2o320b$19b2o17b2o12bo22b2ob4o73b4o
        302b$10b3o7b2o16bobo26b2o7b6o73bo3bo14b2o285b$10bo6bo2bo17bo27b2ob2o6b
        4o74bo19b2o284b$10bobo6bo34b2o11b4o85bo17bo286b$11b2o3b2o34bo15b2o88b
        2o301b$33b2o16bo6bo103b3o296b$33bo17bo8bo94b2o3b2o3bo295b$9bo2bo20bo
        17b8obo93b2ob3obo2bo296b$8bo22b2o23b2o97b9o108bobo10bo175b$8bo3bo143b
        4o112b2o9b2o176b$8b4o13b4o118bo22b4o99bo10b2o175b$25bo3bo22b2o94b2o20b
        o3bo286b$25bo25b2ob2o91b2o21bo8b6o276b$26bo2bo22b4o115bo2bo4bo5bo275b$
        35bo2bo14b2o124bo281b$34bo28b2o115bo4bo275b$34bo3bo7bo15b2o118b2o277b$
        34b4o4bo3b3o15bo396b$40b2o5b2o412b$40b3o6bo8bo402b$40b2o5b2o9b2o401b$
        34b4o4bo3b3o9b2o401b$28bo2bo2bo3bo7bo414b$19b2o6bo6bo426b$18b2ob2o4bo
        3bo3bo2bo22b3o397b$19b4o4b4o22b2o5b5o396b$20b2o30b2o5b2ob3o396b$54bo5b
        2o399b$27bo433b$22b3o3bo78b2o352b$21b3obo3bo18b2o56bobo352b$20b2o6bo
        18b2o59bo156bo195b$21bob5o14bo6bo215bobo193b$22b4o10bo6bo75bo21bo123b
        2o194b$24bo11bo3b2obo74b2o22bo131bo186b$40b3o75bobo19b3o131bobo184b$
        41bo10b3o219b2o185b$19b2o30b5o405b$18b2ob2o14b2o11b2ob3o405b$19b4o13b
        4o11b2o408b$20b2o13b2ob2o421b$36b2o17b2o404b$54b3o31b4o369b$55b2o2b2o
        26b9o365b$59b2o25b2ob3obo2bo364b$50b2o3bo31b2o3b2o3bo363b$49b2ob4obo
        36b3o364b$50b7o33b2o369b$51b2o35bo15bo356b$87bo15bobo355b$37b4o46bo3bo
        13bo355b$36b7o44b4o13bo356b$35b2ob3ob3o416b$36b2o3b2obo416b$69b4o388b$
        39b2o28bo3bo387b$37bo31bo7bo383b$36bo33bo2bo2b7o378b$36bo3bo34b2ob3o2b
        o10bo366b$36b4o30bo2bo2b7o9b3o366b$49bo19bo7bo15bobo365b$48b2o5b2o12bo
        3bo387b$18b4o26bobo3b4o4b4o3b4o388b$18bo3bo10bo19b2ob2o4bo3bo22bo371b$
        18bo7b2o4bobo19b2o6bo25b2o5b2o364b$19bo2bo2b4o3bo2b2o26bo2bo21bobo3b2o
        b3o361b$24b2o3bo5bob2o56b5o361b$19bo2bo2b4o3bo2b2o59b3o362b$18bo7b2o4b
        obo29b2o18bo247bobo10bo115b$4b2o12bo3bo10bo22b2o7bo17b2o247b2o9b2o116b
        $3b4o4b4o3b4o17bo15b2o5bo2bo17bobo241bo5bo10b2o115b$2b2ob2o4bo3bo22b2o
        16b2o4b3o263b2o131b$3b2o6bo26bobo3b2o11bo3b2o15bo248b2o132b$12bo2bo27b
        2ob3o29bo382b$44b5o27bobo382b$16b2o16bo10b3o7b2o20bo383b$6b2o8b2o15b2o
        19b4o18b2o383b$5bo2bo5bo3bo14bobo17b2ob2o403b$4b2o2bo4bo3bo36b2o15b2o
        388b$5b2o2bo2bo4bo52b2ob2o386b$6b4o3bobo13bo41b4o210bobo173b$28b2o42b
        2o212b2o173b$28bobo255bo174b$4b2o335b2o118b$3b4o334bobo117b$2b2ob2o63b
        2o269bo119b$3b2o15b2o32b2o13b2ob2o387b$19b2ob2o29b4o13b4o387b$20b4o28b
        2ob2o14b2o388b$21b2o30b2o406b2$325bo135b$67b2o4bo251bobo133b$56b2o9b2o
        3b3o7bo38b2o198bo3b2o134b$55bo2bo12b2ob2o4b2o23b2o13b2ob2o197bo11bo
        126b$54b2o2bo11b3ob3o4b2o21b4o13b4o195b3o11bobo124b$55b2o2bo11b2ob3o
        26b2ob2o14b2o210b2o125b$56b4o12bobo29b2o355b$87bo373b$85b2o7b2o365b$
        54b2o30b2o5b2ob3o17b2o14bo328b$53b4o4b4o29b5o16bo2bo11b2o329b$52b2ob2o
        4bo3bo3bo2bo22b3o8b2o13b3o7b2o328b$53b2o6bo6bo23bo12b2o5bo8bo2bo336b$
        62bo2bo2bo3bo11b2o4b2o14b2o4bo3bo3b2ob2o336b$68b4o11bo7b2o14bo3bo4bo
        20bo323b$74b3o2b2o7bo25bo20b2o324b$74b3o2b2o8bo46b2o7b2o314b$74b3o2b2o
        7bo8bo7b2o37b2ob3o311b$68b4o11bo11b2o7b4o4b4o29b5o133b2o38b2o136b$68bo
        3bo11b2o10b2o5b2ob2o4bo3bo3bo2bo18bo3b3o135b2o38b2o135b$68bo35b2o6bo6b
        o20b2o141bo39bo137b$69bo2bo40bo2bo2bo3bo7bo9b2o318b$19b2o66bo2bo28b4o
        4bo3b3o255b3o69b$18b4o64bo38b2o5b2o255bo71b$17b2ob2o64bo3bo34b3o6bo
        255bo70b$b2o15b2o66b4o35b2o5b2o327b$2ob2o92bo21b4o4bo3b3o321b2o4b$b4o
        90b2obo20bo3bo7bo190b3o129b2ob4o$2b2o83b3o10bo18bo202bo132b6o$26bobo
        57b5o9bo19bo2bo28bo131bo38bo132b4ob$26b2o42b2o13b2ob4o5bo2bo37bo2bo8b
        2o132b2o61b2o112b$4b4o3bobo13bo41b4o13b2o5b2o3bo38bo13b2o130bobo61bobo
        111b$3b2o2bo2bo4bo52b2ob2o39bo24bo3bo205bo113b$2b2o2bo4bo3bo36b2o15b2o
        39b2o25b4o320b$3bo2bo5bo3bo14bobo17b2ob2o50bo4b2o37bo310b$4b2o8b2o15b
        2o19b4o18b2o24b2o4bo43bo243b5o62b$14b2o16bo10b3o7b2o20bo23b2ob2o2b2o
        30b3o3bo249bo4bo61b$42b5o27bobo23b4ob3o29b5o2bo7bo241bo66b$10bo2bo27b
        2ob3o29bo24b4o3bob2o24b2ob4obo7bo242bo3bo61b$b2o6bo26bobo3b2o11bo3b2o
        15bo28bob5o25b2o258bo63b$2ob2o4bo3bo22b2o16b2o4b3o41b2ob2o352b$b4o4b4o
        3b4o17bo15b2o5bo2bo17bobo22bo354b$2b2o12bo3bo10bo22b2o7bo17b2o19b2ob2o
        354b$16bo7b2o4bobo29b2o18bo18b5o355b$17bo2bo2b4o3bo2b2o59b3o3b2ob3o
        355b$22b2o3bo5bob2o56b5o3b2o358b$17bo2bo2b4o3bo2b2o26bo2bo21bobo3b2ob
        3o363b$16bo7b2o4bobo19b2o6bo25b2o5b2o366b$16bo3bo10bo19b2ob2o4bo3bo22b
        o373b$16b4o26bobo3b4o4b4o3b4o390b$46b2o5b2o12bo3bo389b$47bo19bo7bo15bo
        bo367b$34b4o30bo2bo2b7o9b3o188b2o178b$34bo3bo34b2ob3o2bo10bo188bobo
        177b$34bo33bo2bo2b7o200bo179b$35bo31bo7bo385b$37b2o28bo3bo389b$67b4o
        390b$34b2o3b2obo418b$33b2ob3ob3o418b$34b7o44b4o13bo358b$35b4o46bo3bo
        13bo357b$85bo15bobo357b$49b2o35bo15bo358b$48b7o33b2o371b$47b2ob4obo36b
        3o366b$48b2o3bo31b2o3b2o3bo105b2o258b$57b2o25b2ob3obo2bo104bo4bo256b$
        53b2o2b2o26b9o104bo262b$52b3o31b4o100bo2bo4bo5bo256b$53b2o134bo8b6o
        257b$40bo2bo145bo3bo267b$39bo9b2o138b4o268b$39bo3bo4b2ob3o121b4o282b$
        22b4o13b4o6b5o120b7o4b2o274b$22bo3bo23b3o120b2ob3ob2o2bobo274b$22bo93b
        obo55b2o3b2o2bo2b2o273b$23bo2bo89b2o65bo2bo274b$43b3o71bo25b2o32b2o4bo
        bo275b$27bo10bobobo3bo97b2o29bo8bo276b$25b3o10bo7bo59bo36bo30bo14b2o
        270b$24bo3bo15b2o5bo52bobo67bo3bo10bobo269b$24bo4b3o19bobo51b2o67b4o
        11bo139b3o129b$24b2obob3o8bo10b2o105b2o169bo131b$26bo3b2o34bo90b4o169b
        o130b$27bobo34bo3bo87b2ob2o9bo23b3o264b$56bo6bo93b2o11bo22b5o263b$56bo
        bo4bo4bo94bobo4b2o2bo17b2ob3o64b3o196b$22b4o5b2o23b2o5b5o94b2o2bo7bo
        18b2o67bo198b$22bo3bo3b2ob2o4b2o122bobo4b2o2bo88bo197b$22bo8b4o3b4o
        115b2o11bo8b2o106b2o172b$23bo2bo5b2o3b2ob2o19bo80bo2bo5b2o3b2ob2o9bo8b
        obo105bobo171b$38b2o5b2ob3o12bo77bo8b4o3b4o18bo107bo173b$44bo5b2o8bobo
        78bo3bo3b2ob2o4b2o301b$43b2o7bo8bo79b4o5b2o30b5o274b$44bo5b2o122b2o6bo
        4bo273b$38b2o5b2ob3o15bo107bobo5bo56bo221b$37b2ob2o24bobo92bo12bo8bo3b
        o42b6obo3bo219b$38b4o24b2o77b2o13bo2bo21bo32b2o10bo5bo3b3o218b$39b2o
        102b2ob2o11bo3bo53b2ob2o8bo5bo5bo218b$55b4o84bo2bo12bo3bo5b2o47b4o9bo
        3bo3b2obo218b$55bo3bo83bo2bo12bo3bo5bobo47b2o12bo5b3o219b$55bo88b2o9b
        2o3bobo6bo62b2o227b$56bo98b2o4bo69b4o226b$58b2o170b2ob2o226b$142bo2bo
        85b2o228b$55b2o3b2obo77bo319b$54b2ob3ob3o77bo3bo315b$55b7o79b4o13b4o
        51b2o246b$56b4o98bo3bo49b2ob2o8bo235b$70b4o84bo54b4o3bo4bobo233b$70bo
        3bo84bo2bo51b2o3bo5bo2bo232b$70bo8b6o133bo2bo6bo232b$71bo2bo4bo5bo128b
        2o3bo5bo2bo8bo223b$79bo133b4o3bo4bobo9b2o222b$80bo4bo126b2ob2o8bo235b$
        82b2o113b4o5b2o5b2o26bo219b$197bo3bo3b2ob2o22b3o4bo3bo217b$197bo8b4o
        22bo5bo222b$198bo2bo5b2o24bo4bo4bo217b$238b5o218b$210bo250b$200b2o8b2o
        15b3o231b$199bo2bo9bo14bo233b$199bo2bo4b5o16bo232b$199b2ob2o3b4o250b$
        201b2o4bo253b$222b3o236b$222bo238b$223bo237b$197b4o260b$197bo3bo13bo2b
        o6b2o234b$197bo16bo8bo237b$198bo2bo12bo3bo3bo6b2o3b2o225b$214b4o4bo7bo
        2bo227b$222b12ob2o224b$227b2o2b2ob3o224b$232bobo226b$233bo227b$223b2o
        236b$222b2ob2o234b$223b4o234b$224b2o43b3o189b$206b2o61bo191b$205b4o61b
        o190b$204b2ob2o252b$205b2o5b2ob3o243b$211bo5b2o242b$210b2o7bo241b$211b
        o5b2o242b$205b2o5b2ob3o9b2o232b$190bo2bo5b2o3b2ob2o18bobo231b$189bo8b
        4o3b4o18bo233b$189bo3bo3b2ob2o4b2o253b$189b4o5b2o30b5o226b$222b2o6bo4b
        o225b$222bobo5bo230b$209bo12bo8bo3bo225b$193b2o13bo2bo21bo227b$191b2ob
        2o11bo3bo249b$191bo2bo12bo3bo5b2o242b$191bo2bo12bo3bo5bobo241b$192b2o
        9b2o3bobo6bo243b$203b2o4bo24bo226b$225b6obo3bo224b$190bo2bo31bo5bo3b3o
        223b$189bo35bo5bo5bo223b$189bo3bo32bo3bo3b2obo223b$189b4o13b4o18bo5b3o
        224b$206bo3bo16b2o232b$206bo19b4o231b$207bo2bo14b2ob2o231b$226b2o11b3o
        219b$239bo221b$240bo220b$208b2o251b$207b2ob2o8bo240b$208b4o3bo4bobo
        238b$209b2o3bo5bo2bo237b$213bo2bo6bo237b$209b2o3bo5bo2bo237b$208b4o3bo
        4bobo238b$207b2ob2o8bo8b3o229b$192b4o5b2o5b2o19bo6bo224b$192bo3bo3b2ob
        2o25bo3bo3bo222b$192bo8b4o28bo227b$193bo2bo5b2o29bo4bo222b$224b3o6b5o
        223b$224bo236b$195b2o7bo20bo235b$194bobo3b2o7b5o247b$194bo18bo247b$
        194b3o13b3o6b3o239b$205b2o4bo7bo241b$205b2o13bo240b3$192b4o265b$192bo
        3bo13bo2bo247b$192bo16bo251b$193bo2bo12bo3bo247b$209b4o!`,
            group: patternGroups.puffer,
        },
        "gosper-glider-gun": {
            name: "Планерное ружьё Госпера",
            code: `24bo11b$22bobo11b$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o14b$2o8b
        o3bob2o4bobo11b$10bo5bo7bo11b$11bo3bo20b$12b2o!`,
            group: patternGroups.gun,
        },
        "simkin-glider-gun": {
            name: "Планерное ружьё Симкина",
            code: `2o5b2o$2o5b2o2$4b2o$4b2o5$22b2ob2o$21bo5bo$21bo6bo2b2o$21b3o3bo3b2o$
        26bo4$20b2o$20bo$21b3o$23bo!`,
            group: patternGroups.gun,
        },
        "ak-94": {
            name: "AK-94",
            code: `7bo7bo7b2o$7b3o5b3o5b2o$10bo7bo$9b2o6b2o16b2o$30b2o2bo2bo$30bobo2b2o$
        33b2o$5bo28bo$5b3o26bob2o$8bo22b2obo2bo$7b2o22b2ob2o3$17bo$2b2ob2o9bob
        o10b2o$o2bob2o8bo3bo9bo$2obo11bo3bo10b3o$3bo11bo3bo12bo$3b2o11bobo$b2o
        2bobo9bo$o2bo2b2o$b2o16b2o$19bo$13b2o5b3o$13b2o7bo!`,
            group: patternGroups.gun,
        },
        "slide-gun": {
            name: "Скользящее ружьё",
            code: `56b2o51b$56b2o51b2$78bo30b$78bobo28b$81b2o6b2o18b$38b2o27b2o12b2o4bo3b
        o17b$38b2o16b3o8b2o12b2o3bo5bo8b2o6b$78bobo4b2obo3bo8b2o6b$56bobo19bo
        7bo5bo16b$55b5o27bo3bo17b$54b2o3b2o4b2o22b2o18b$54b2o3b2o3bo2bo11bo29b
        $64bo12b2o30b$64bo13b2o29b$64bob2o41b$66b2o41b2$83b2o24b$59b2o4b2o15b
        2o10bobo12b$59bo5b2o17bo8bo2bo12b$60b3o16b2o11b2o10b2o3b$62bo16bobo8b
        2o3bo8b2o3b$74b2o6bo9b2o5b2o8b$73bo2bo2bo2bo10bo2bo4bo7b$73b3o6bo11bob
        o12b$46b3o22b3o5bobo27b$48bo15bo5bobo6b2o28b$47bo14b2o6bo38b$63b2o4b2o
        38b$55bo53b$35b2o17bobo52b$35bo18b2obo14b2o35b$24bo8bobo18b2ob2o14bo
        35b$24b4o5b2o19b2obo15bobo10bo22b$8bo16b4o15b2o8bobo4b2o11b2o9b4o20b$
        7bobo5b2o8bo2bo14bobo9bo5bobo7bo12b2ob4o5b2o11b$5b2o3bo14b4o14bo19bo6b
        2o11b3ob2o3bo3bo2bo9b$2o3b2o3bo4bobob2o3b4o14b2o19b2o5bobo11b2ob2o3bo
        7bo8b$2o3b2o3bo5b2o3bo2bo60b5o3bo6bo6b2o$7bobo10bo18b2o45bo3b3o7bo6b2o
        $8bo8bo2bo10b3o4bobo27b2o26bo2bo9b$33bo3b3o28bo2bo24b2o11b$32bo4b2o70b
        $40b2o26bo2bo12bo24b$27bo11b3o25bo2bo11b2o25b$28bo38bobo12b3o24b$28bo
        39bo11b3o26b$24bo2bo11b2o39b2o27b$6bo5b2o9bo15b2o27b2o39b$4bo3bo3b3o
        10bo42b2o16b2o9bo11b$8bo5b2obo11bo55b4o7bobo10b$3bo5bo4bo2bo10b2o50bob
        o2bo2b3o5b2obo9b$3b2o9b2obo9b2o4b2o2b2o40bo2bo2b2o9b2ob2o3b2o3b$12b3o
        11b3o4b2o2b2o31b2o6b2o9bo6b2obo4b2o3b$12b2o13b2o4b2o35b2o4b2o3bo8bo5bo
        bo10b$28b2o48b2o10bo6bo11b$29bo49bo2bo26b$80bobo!`,
            group: patternGroups.gun,
        },
        block: {
            name: "Блок, 1",
            code: `2o$2o!`,
            group: patternGroups.oscillator,
        },
        blinker: {
            name: "Мигалка, 2",
            code: `3o!`,
            group: patternGroups.oscillator,
        },
        "figure-8": {
            name: "Фигура 8, 8",
            code: `2o4b$2obo2b$4bob$bo4b$2bob2o$4b2o!`,
            group: patternGroups.oscillator,
        },
        "43P18": {
            name: "43P18, 18",
            code: `4bo$4obo$3obobo$5bobo$6bo$5b2o$5b2o3bo$5b2o2bobob2o$13b2o3$7bo2bo$7bo$
        6bo4bo$5bobo2b2o$3b2obo3$3bo2bo$5b2o!`,
            group: patternGroups.oscillator,
        },
        beluchenko: {
            name: "Осциллятор Белученко, 37",
            code: `11b2o11b2o11b$11b2o11b2o11b3$6bo23bo6b$5bobo5bo9bo5bobo5b$4bo2bo5bob2o
        3b2obo5bo2bo4b$5b2o10bobo10b2o5b$15bobobobo15b$16bo3bo16b2$2o33b2o$2o
        33b2o$5b2o23b2o5b2$6bobo19bobo6b$6bo2bo17bo2bo6b$7b2o19b2o7b2$7b2o19b
        2o7b$6bo2bo17bo2bo6b$6bobo19bobo6b2$5b2o23b2o5b$2o33b2o$2o33b2o2$16bo
        3bo16b$15bobobobo15b$5b2o10bobo10b2o5b$4bo2bo5bob2o3b2obo5bo2bo4b$5bob
        o5bo9bo5bobo5b$6bo23bo6b3$11b2o11b2o11b$11b2o11b2o!`,
            group: patternGroups.oscillator,
        },
        "60P312": {
            name: "60P312, 312",
            code: `20b2o$20b2o4$9b2o$8bo2bo10b2o$9b2o11bo$22bo12bo$23bo10bobo$34bobo$35bo
        7$32bo2bo$33b3o$2o38b2o$2o38b2o$6b3o$6bo2bo7$6bo$5bobo$5bobo10bo$6bo
        12bo$19bo11b2o$18b2o10bo2bo$31b2o4$20b2o$20b2o!`,
            group: patternGroups.oscillator,
        },
    };

type GameData = {
    array: [number, number][];
    height: number;
    width: number;
};
const cache: Record<string, GameData> = {};
function getDataFromRLE(RLEString: string): GameData {
    if (RLEString in cache) {
        return cache[RLEString];
    }
    const s = RLEString.replace(/\s|\n/g, "").split("!")[0];
    const rows = s.split("$");
    const result: GameData["array"] = [];
    let j = 0; // номер строки
    let maxI = 0;
    for (const row of rows) {
        const parts = row.match(/\d*[bo]/g);
        if (!parts) continue;
        let i = 0; // номер столбца
        for (const part of parts) {
            // 5bobo10bo -> 5, 1, 1, 1, 10, 1
            const l = part.length === 1 ? 1 : Number(part.slice(0, -1));
            if (part.endsWith("o")) {
                // живые клетки записываем явно
                const end = i + l;
                while (i < end) {
                    result.push([j, i]);
                    i++;
                }
            } else {
                // мёртвые пропускаем
                i += l;
            }
        }
        if (i > maxI) {
            maxI = i;
        }
        const linesCount = row.match(/\d+$/);
        if (linesCount) {
            // пропускаем пустые строки
            j += Number(linesCount[0]);
        } else {
            j++;
        }
    }
    const data: GameData = { array: result, width: maxI, height: j };
    cache[RLEString] = data;
    return data;
}

let gameTimeout: number | null;

const Game = Component<{ H?: number; W?: number }>(
    "Game",
    ({ props, state, hooks }) => {
        const { H = 600, W = 1000 } = props();

        const [getI, setI] = state(0);
        const [getSize, setSize] = state(0);
        const [getStop, setStop] = state(true);
        const [getPaint, setPaint] = state(false);
        const [getRule, setRule] = state({
            new: [false, false, true, true, false, false, false, false, false],
            old: [false, false, false, true, false, false, false, false, false],
        } as Record<"old" | "new", boolean[]>);
        const [getCustom, setCustom] = state(false);
        const [getPattern, setPattern] = state<keyof typeof patterns>(
            "3-engine-cordership-rake"
        );

        const [getTime, setTime] = state(0);

        let canvas: HTMLCanvasElement,
            img_data: ImageData,
            data: Uint8ClampedArray,
            ctx: CanvasRenderingContext2D,
            fieldState: boolean[],
            fieldStateNext: boolean[];

        hooks.mount(() => {
            // const { H, W } = props();
            const pattern = getPattern();

            if (gameTimeout) {
                window.clearTimeout(gameTimeout);
                gameTimeout = null;
            }

            fieldState = new Array(H * W);
            fieldStateNext = new Array(H * W);
            for (let i = 0; i < H * W; i++) {
                fieldState[i] = false;
                fieldStateNext[i] = false;
            }

            const startData = getDataFromRLE(patterns[pattern].code);
            set_life(startData.array, startData.height, startData.width);

            canvas = document.getElementById("field")! as any;
            canvas.willReadFrequently = true;
            ctx = canvas.getContext("2d", {
                alpha: false,
            })!;
            img_data = ctx.getImageData(0, 0, W, H);
            data = img_data.data;
            for (let k = 0; k < H * W * 4; k++) {
                data[k] = (k + 1) % 4 == 0 ? 255 : 0;
            }

            draw();
            setSize(fieldState.reduce((sum, x) => (sum += +x), 0));
        });

        function paintControl() {
            const paint = getPaint();
            if (!paint) {
                canvas.onmousedown = null;
                canvas.onmouseup = null;
                canvas.onmouseout = null;
                canvas.onmousemove = null;
                return;
            }
            canvas.onmousedown = startDrawing;
            canvas.onmouseup = stopDrawing;
            canvas.onmouseout = stopDrawing;
            canvas.onmousemove = draw;

            let context = ctx;
            let isDrawing: boolean;

            context.strokeStyle = "rgb(255,0,0)";
            context.lineWidth = 1;

            let pause = false;
            const { x, y } = canvas.getBoundingClientRect();

            function startDrawing(e: MouseEvent) {
                // Начинаем рисовать
                isDrawing = true;
                if (!getStop()) {
                    setStop(true);
                    pause = true;
                }

                // Создаем новый путь (с текущим цветом и толщиной линии)
                context.beginPath();

                // Нажатием левой кнопки мыши помещаем "кисть" на холст
                context.moveTo(e.clientX - x, e.clientY - y);
            }

            function draw(e: MouseEvent) {
                if (isDrawing == true) {
                    // Определяем текущие координаты указателя мыши
                    var xd = e.clientX - x;
                    var yd = e.clientY - y;

                    // Рисуем линию до новой координаты
                    context.lineTo(xd, yd);
                    context.stroke();
                }
            }

            function stopDrawing() {
                isDrawing = false;

                // const { W, H } = state();
                img_data = ctx.getImageData(0, 0, W, H);
                data = img_data.data;
                for (let k = 0; k < H * W; k++) {
                    fieldState[k] = data[k * 4] === 255;
                }

                if (pause) {
                    setStop(false);
                    setI(0);
                    life();
                    pause = false;
                }
            }
        }

        function torsum(i: number, j: number) {
            // const { H, W } = state();
            // положение строки над текущей клеткой
            const i_top_W = (i ? i - 1 : H - 1) * W;
            // положение строки под текущей клеткой
            const i_down_W = (H - 1 - i ? i + 1 : 0) * W;
            // положение строки текущей клетки
            const i_W = i * W;
            // столбец слева от текущей клетки
            const j_l = j ? j - 1 : W - 1;
            // столбец справа от текущей клетки
            const j_r = W - 1 - j ? j + 1 : 0;
            return (
                +fieldState[i_top_W + j_l] +
                +fieldState[i_top_W + j] +
                +fieldState[i_top_W + j_r] +
                +fieldState[i_W + j_l] +
                +fieldState[i_W + j_r] +
                +fieldState[i_down_W + j_l] +
                +fieldState[i_down_W + j] +
                +fieldState[i_down_W + j_r]
            );
        }

        function set_life(
            array: [number, number][],
            height?: number,
            width?: number
        ) {
            const getMiddle = (x: number) => (x - (x % 2)) / 2;
            const startX = getMiddle(W - (width || 0));
            const startY = getMiddle(H - (height || 0));
            for (const e of array) {
                const index = (startY + e[0]) * W + startX + e[1];
                fieldState[index] = true;
                fieldStateNext[index] = true;
            }
            setSize(array.length);
        }

        function clear() {
            for (let k = 0; k < H * W * 4; k++) {
                data[k] = (k + 1) % 4 === 0 ? 255 : 0;
            }
            for (let k = 0; k < H * W; k++) {
                fieldState[k] = data[k * 4] === 255;
            }
            ctx.putImageData(img_data, 0, 0);
            setStop(true);
            setI(0);
            setSize(0);
        }

        function draw() {
            const S = H * W;

            for (let k = 0; k < S; k++) {
                if (fieldState[k] === !data[k * 4]) {
                    data[k * 4] = fieldState[k] ? 255 : 0;
                }
            }
            ctx.putImageData(img_data, 0, 0);
        }

        function step() {
            const rule = getRule();
            let i,
                j,
                k = 0;
            for (i = 0; i < H; i++) {
                for (j = 0; j < W; j++) {
                    // const sum = ;
                    const type = fieldState[k] ? "new" : "old";
                    fieldStateNext[k] = rule[type][torsum(i, j)];
                    k++;
                }
            }
            const S = H * W;
            for (k = 0; k < S; k++) {
                fieldState[k] = fieldStateNext[k];
            }
        }

        function one_step() {
            const start = Date.now();
            step();
            draw();
            setSize(fieldState.reduce((sum, x) => (sum += +x), 0));
            setI((i) => i + 1);
            const time = Date.now() - start;
            setTime((oldTime) =>
                Math.abs(time - oldTime) > 1 ? time : oldTime
            );
        }

        function life() {
            const stop = getStop();
            if (!stop) {
                one_step();
                gameTimeout = window.setTimeout(life, 0);
            } else if (gameTimeout) {
                window.clearTimeout(gameTimeout);
                gameTimeout = null;
            }
        }

        function onRuleChange(type: "old" | "new", i: number) {
            let prevStop = getStop();
            setStop(true);
            setRule((prevRule) => {
                prevRule[type][i] = !prevRule[type][i];
                return prevRule;
            });
            setStop(prevStop);
        }

        function getRuleCaption(type: "old" | "new") {
            const rule = getRule();
            const result = [];
            for (let i = 0; i < rule[type].length; i++) {
                if (rule[type][i]) {
                    result.push(i);
                }
            }
            return result.join("");
        }

        return () => {
            const stop = getStop();
            const i = getI();
            const size = getSize();
            const rule = getRule();
            const paint = getPaint();
            const custom = getCustom();
            const pattern = getPattern();
            const time = getTime();

            return (
                <div>
                    <Breadcrumbs
                        items={[
                            [<Lang token={`menu/projects`} />, "projects"],
                            ["Игра «Жизнь»"],
                        ]}
                    />
                    <div class={b()}>
                        <div>
                            Начальная конфигурация
                            <br />
                            <sup>
                                имеет смысл для классической версии, правила
                                B3/S23
                            </sup>
                            <br />
                            <div
                                style={`margin: 4px 0;
                        margin-right: 8px;
                        display: inline-block;`}
                            >
                                <Select
                                    onUpdate={(value) => {
                                        setPattern(value);
                                    }}
                                    values={Object.keys(patterns).map(
                                        (patternKey) => ({
                                            value: patternKey,
                                            title: patterns[patternKey].name,
                                            group: patterns[patternKey].group,
                                            selected: pattern === patternKey,
                                        })
                                    )}
                                />
                            </div>
                            <Button
                                on:click={() => {
                                    const data = getDataFromRLE(
                                        patterns[pattern].code
                                    );
                                    clear();
                                    set_life(
                                        data.array,
                                        data.height,
                                        data.width
                                    );
                                    draw();
                                }}
                            >
                                Установить
                            </Button>
                            <div>
                                <Checkbox
                                    checked={custom}
                                    on:click={() => setCustom((prev) => !prev)}
                                >
                                    код конфигурации
                                </Checkbox>
                                <br />
                                {custom && (
                                    <textarea
                                        style={`
                                            height: 4em;
                                            min-height: 4em;
                                            max-height: 50vh;
                                            width: ${W}px;
                                            min-width: ${W}px;
                                            max-width: ${W}px;`}
                                    >
                                        {
                                            patterns[pattern].code
                                                .replace(/\s|\n/g, "")
                                                .split("!")[0]
                                        }
                                    </textarea>
                                )}
                            </div>
                        </div>
                        <div class={b("actions")}>
                            <Button
                                on:click={() => {
                                    setStop(NOT);
                                    life();
                                }}
                            >
                                <div
                                    title={stop ? "play" : "stop"}
                                    style={`width: 1em; height: 1em; margin: 4px 8px;`}
                                >
                                    {stop ? <Icon.Play /> : <Icon.Pause />}
                                </div>
                            </Button>
                            <Button
                                disabled={!stop}
                                on:click={() => one_step()}
                            >
                                <div
                                    title={"single step"}
                                    style={`width: 1em; height: 1em; margin: 4px 8px; margin-right: 2px; display: inline-block`}
                                >
                                    <Icon.StepForward />
                                </div>
                                <sup>1</sup>
                            </Button>
                            <Button
                                class={b("paint", { active: paint })}
                                on:click={() => {
                                    setPaint(NOT);
                                    paintControl();
                                }}
                            >
                                <div
                                    title={"paint"}
                                    style={`width: 1em; height: 1em; margin: 4px 8px; `}
                                >
                                    <Icon.PencilAlt />
                                </div>
                            </Button>
                            <Button on:click={() => clear()}>
                                <div
                                    title={"clear"}
                                    style={`width: 1em; height: 1em; margin: 4px 8px; `}
                                >
                                    <Icon.Ban />
                                </div>
                            </Button>
                            <div
                                style={`display: inline-grid;grid-template-columns: repeat(3, auto);margin-left: 1em; gap: 8px;`}
                            >
                                <div>
                                    <div>Поколение</div>
                                    <div>
                                        <b>{i}</b>
                                    </div>
                                </div>
                                <div>
                                    <div>Популяция</div>
                                    <div>
                                        <b>{size}</b>
                                    </div>
                                </div>
                                <div>
                                    <div>Скорость</div>
                                    <div>
                                        {time && (
                                            <>
                                                {Math.floor(1000 / time)} FPS (
                                                {time}ms)
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <canvas
                            id={"field"}
                            width={W}
                            height={H}
                            class={b("canvas", { paint })}
                        />
                        <p>
                            Текущее правило: B{getRuleCaption("old")}/S
                            {getRuleCaption("new")}
                        </p>
                        <br />
                        <div>
                            <p>Зарождение жизни</p>
                            {range(0, 8).map((i) => (
                                <Checkbox
                                    checked={rule.old[`${i}`]}
                                    on:change={() => onRuleChange("old", i)}
                                >
                                    {i}
                                </Checkbox>
                            ))}
                        </div>
                        <div>
                            <p>Продление жизни</p>
                            {range(0, 8).map((i) => (
                                <Checkbox
                                    checked={rule.new[`${i}`]}
                                    on:change={() => onRuleChange("new", i)}
                                >
                                    {i}
                                </Checkbox>
                            ))}
                        </div>
                        <br />
                        <p>
                            Представлена расширенная версия клеточного автомата{" "}
                            <a
                                href={
                                    "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
                                }
                            >
                                Игра Жизнь
                            </a>
                            . Правила касаются общей суммы клеток в окрестности
                            Мура. Начальные конфигурации взяты с{" "}
                            <a
                                href={
                                    "https://www.conwaylife.com/wiki/Main_Page"
                                }
                            >
                                тематического вики-сайта
                            </a>
                            . Подробнее о реализации читайте в{" "}
                            <a href={"/?/blog/6"}>блоге</a>
                        </p>
                    </div>
                </div>
            );
        };
    }
);

export default Game;
