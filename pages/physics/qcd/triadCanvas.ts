import { signedPhaseDelta, TAU, wrapPhase } from "./model";
import { drawFieldArrow, FieldArrow, makeFieldArrow } from "./fieldArrows";
import { columnColor, COLUMN_NAMES, TriadColumn } from "./triad";
import { TORUS_EDGE, TORUS_SIZE, TORUS_SPAN } from "./torusGeometry";

export const PLOT_SIZE = TORUS_SIZE;
const EDGE = TORUS_EDGE;
const SPAN = TORUS_SPAN;
const LENGTH = 62;
type ColumnFieldArrow = FieldArrow & { column: number; field: number };
export const plotPoint = (column: TriadColumn) => ({
    x: EDGE + column.deltaGreen / TAU * SPAN,
    y: EDGE + (1 - column.deltaBlue / TAU) * SPAN,
});

export const phasesAtPoint = (x: number, y: number) => {
    const unit = (value: number) => Math.max(0, Math.min(1, value));
    return {
        green: wrapPhase(unit((x - EDGE) / SPAN) * TAU),
        blue: wrapPhase(unit(1 - (y - EDGE) / SPAN) * TAU),
    };
};

export function fieldArrows(columns: TriadColumn[], futures: TriadColumn[][]): ColumnFieldArrow[] {
    const arrows: ColumnFieldArrow[] = [];
    columns.forEach(column => {
        if (!column.active) return;
        const base = plotPoint(column);
        futures.forEach((future, field) => {
            const next = future[column.index];
            const dx = next.active ? signedPhaseDelta(next.deltaGreen - column.deltaGreen) / TAU * SPAN : 0;
            const dy = next.active ? -signedPhaseDelta(next.deltaBlue - column.deltaBlue) / TAU * SPAN : 0;
            arrows.push({
                ...makeFieldArrow(base.x, base.y, dx, dy, field,
                    columnColor(column), next.active ? columnColor(next) : columnColor(column, true)),
                column: column.index, field,
            });
        });
    });
    return arrows;
}

export function hitFieldArrow(arrows: ColumnFieldArrow[], x: number, y: number) {
    let hit: ColumnFieldArrow | null = null;
    let closest = 10;
    for (const arrow of arrows) for (const sx of [-SPAN, 0, SPAN]) for (const sy of [-SPAN, 0, SPAN]) {
        const labelDistance = Math.hypot(x - arrow.labelX - sx, y - arrow.labelY - sy);
        if (labelDistance < closest) { closest = labelDistance; hit = arrow; }
        const dx = arrow.x2 - arrow.x1, dy = arrow.y2 - arrow.y1;
        const ox = x - arrow.x1 - sx, oy = y - arrow.y1 - sy;
        if (dx * dx + dy * dy < 36) {
            const distance = Math.hypot(ox, oy);
            if (distance < closest) { closest = distance; hit = arrow; }
            continue;
        }
        const t = (ox * dx + oy * dy) / (dx * dx + dy * dy);
        if (t < .25 || t > 1.14) continue;
        const distance = Math.hypot(ox - Math.max(0, Math.min(1, t)) * dx,
            oy - Math.max(0, Math.min(1, t)) * dy);
        if (distance < closest) { closest = distance; hit = arrow; }
    }
    return hit;
}

export function drawTriad(
    canvas: HTMLCanvasElement, columns: TriadColumn[], future: TriadColumn[] | null,
    selected: number, arrows: ColumnFieldArrow[], selectedField: number, hoveredField: number | null
) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const styles = getComputedStyle(document.body);
    const text = styles.getPropertyValue("--color-text").trim() || "#777";
    const border = styles.getPropertyValue("--color-border-contrast").trim() || "#888";
    const background = styles.getPropertyValue("--color-background-second").trim() || "#fff";
    ctx.clearRect(0, 0, PLOT_SIZE, PLOT_SIZE);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, PLOT_SIZE, PLOT_SIZE);
    ctx.save();
    ctx.beginPath();
    ctx.rect(EDGE, EDGE, SPAN, SPAN);
    ctx.clip();

    // Shortest periodic edges group the columns; they are not physical distances.
    const active = columns.filter(c => c.active);
    if (active.length > 1) {
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 8]);
        for (let i = 0; i < (active.length === 2 ? 1 : active.length); i++) {
            const a = plotPoint(active[i]);
            const b = plotPoint(active[(i + 1) % active.length]);
            const dx = b.x - a.x - Math.round((b.x - a.x) / SPAN) * SPAN;
            const dy = b.y - a.y - Math.round((b.y - a.y) / SPAN) * SPAN;
            for (const sx of [-SPAN, 0, SPAN]) for (const sy of [-SPAN, 0, SPAN]) {
                ctx.beginPath(); ctx.moveTo(a.x + sx, a.y + sy);
                ctx.lineTo(a.x + sx + dx, a.y + sy + dy); ctx.stroke();
            }
        }
        ctx.setLineDash([]);
    }
    const fieldArrow = (arrow: ColumnFieldArrow) => {
        const activeField = (hoveredField ?? selectedField) === arrow.field;
        for (const sx of [-SPAN, 0, SPAN]) for (const sy of [-SPAN, 0, SPAN]) {
            const x1 = arrow.x1 + sx, y1 = arrow.y1 + sy;
            const x2 = arrow.x2 + sx, y2 = arrow.y2 + sy;
            if (Math.max(x1, x2) < -18 || Math.min(x1, x2) > PLOT_SIZE + 18 ||
                Math.max(y1, y2) < -18 || Math.min(y1, y2) > PLOT_SIZE + 18) continue;
            drawFieldArrow(ctx, arrow, activeField, sx, sy);
        }
    };
    arrows.filter(a => a.field !== (hoveredField ?? selectedField)).forEach(fieldArrow);
    arrows.filter(a => a.field === (hoveredField ?? selectedField)).forEach(fieldArrow);
    const arrow = (c: TriadColumn, preview: boolean) => {
        if (!c.active) return;
        const position = plotPoint(c);
        for (const sx of [-SPAN, 0, SPAN]) for (const sy of [-SPAN, 0, SPAN]) {
            const x = position.x + sx, y = position.y + sy;
            if (x < -LENGTH || x > PLOT_SIZE + LENGTH || y < -LENGTH || y > PLOT_SIZE + LENGTH) continue;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(-c.phase);
            ctx.beginPath();
            ctx.moveTo(0, -8); ctx.lineTo(LENGTH - 26, -8);
            ctx.lineTo(LENGTH - 26, -19); ctx.lineTo(LENGTH, 0);
            ctx.lineTo(LENGTH - 26, 19); ctx.lineTo(LENGTH - 26, 8);
            ctx.lineTo(0, 8); ctx.closePath();
            if (preview) {
                ctx.setLineDash([5, 5]);
                ctx.strokeStyle = columnColor(c, true);
                ctx.lineWidth = 2.5; ctx.stroke();
            } else {
                const gradient = ctx.createLinearGradient(0, 0, LENGTH, 0);
                gradient.addColorStop(0, columnColor(c));
                gradient.addColorStop(.58, columnColor(c));
                gradient.addColorStop(.7, columnColor(c, true));
                gradient.addColorStop(1, columnColor(c, true));
                ctx.fillStyle = gradient; ctx.fill();
                ctx.strokeStyle = c.index === selected ? text : border;
                ctx.lineWidth = c.index === selected ? 2 : .7; ctx.stroke();
            }
            ctx.restore();
            if (!preview) {
                ctx.strokeStyle = text;
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(x - 5, y); ctx.lineTo(x + 5, y);
                ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5); ctx.stroke();
                ctx.font = "18px Arial"; ctx.textAlign = "center";
                ctx.strokeStyle = background; ctx.lineWidth = 4;
                const label = "v" + COLUMN_NAMES[c.index] + (c.singular ? "*" : "");
                ctx.strokeText(label, x, y - 23);
                ctx.fillStyle = text; ctx.fillText(label, x, y - 23);
            }
        }
    };
    // Keep the selected column readable if multiple columns coincide.
    columns.filter(c => c.index !== selected).forEach(c => arrow(c, false));
    arrow(columns[selected], false);
    future?.forEach(c => arrow(c, true));
    ctx.restore();
    ctx.strokeStyle = border; ctx.lineWidth = 2;
    ctx.strokeRect(EDGE, EDGE, SPAN, SPAN);
}

export function hitColumn(columns: TriadColumn[], x: number, y: number) {
    let result: number | null = null;
    let closest = 24;
    for (const c of columns) {
        if (!c.active) continue;
        const point = plotPoint(c);
        const dx = LENGTH * Math.cos(c.phase), dy = -LENGTH * Math.sin(c.phase);
        for (const sx of [-SPAN, 0, SPAN]) for (const sy of [-SPAN, 0, SPAN]) {
            const ox = x - point.x - sx, oy = y - point.y - sy;
            const t = Math.max(0, Math.min(1, (ox * dx + oy * dy) / (LENGTH ** 2)));
            const distance = Math.hypot(ox - t * dx, oy - t * dy);
            if (distance < closest) { closest = distance; result = c.index; }
        }
    }
    return result;
}
