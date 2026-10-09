import { Component } from "parvis";

type Props = {
    torus: JSX.Element;
    state: JSX.Element;
};

export const QCDPanels = Component<Props>("QCDPanels", ({ props }) => () => (
    <div class="qcd__panel-layout">
        <div class="qcd__panel qcd__panel_torus">{props().torus}</div>
        <div class="qcd__panel qcd__panel_state">{props().state}</div>
    </div>
));
