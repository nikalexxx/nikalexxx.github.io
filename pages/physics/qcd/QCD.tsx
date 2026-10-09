import { Component } from "parvis";
import { Lang } from "../../../blocks";
import { Breadcrumbs } from "../../../components";
import { block } from "../../../utils";
import { QCDExperience } from "./QCDExperience";
import "./QCD.less";

const b = block("qcd");

export const QCD = Component("QCD", () => () => (
        <div class={b()}>
            <Breadcrumbs items={[
                [<Lang token="menu/physics" />, "physics"],
                [<Lang token="tile/qcd" />],
            ]} />
            <QCDExperience />
        </div>
));
