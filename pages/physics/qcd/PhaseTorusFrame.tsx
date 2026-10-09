export const phaseTorusFrame = (canvas: JSX.Element) => (
    <div class="qcd__torus-frame">
        <div class="qcd__phase-plot">
            <div class="qcd__phase-y-title">относительная фаза синего Δφb</div>
            <div class="qcd__phase-y-values"><span>2π ≡ 0</span><span>0</span></div>
            {canvas}
            <div class="qcd__phase-x-values"><span>Δφg = 0</span><span>2π ≡ 0</span></div>
            <div class="qcd__phase-x-title">относительная фаза зелёного Δφg</div>
        </div>
        <div class="qcd__boundary-note">↔ противоположные стороны квадрата склеены</div>
    </div>
);
