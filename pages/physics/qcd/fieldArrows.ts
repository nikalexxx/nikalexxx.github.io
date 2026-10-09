import { TAU } from "./model";

export type FieldArrow = {
    index: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    labelX: number;
    labelY: number;
    ux: number;
    uy: number;
    from: string;
    to: string;
};

const START_DISTANCE = 15;
const visualLength = (distance: number) => 35 * Math.log1p(distance);

export function makeFieldArrow(
    x: number, y: number, dx: number, dy: number,
    index: number, from: string, to: string
): FieldArrow {
    const distance = Math.hypot(dx, dy);
    const fallback = -Math.PI / 2 + index * TAU / 8;
    const ux = distance > .5 ? dx / distance : Math.cos(fallback);
    const uy = distance > .5 ? dy / distance : Math.sin(fallback);
    const length = visualLength(distance);
    const x1 = x + ux * START_DISTANCE;
    const y1 = y + uy * START_DISTANCE;
    const x2 = x1 + ux * length;
    const y2 = y1 + uy * length;
    const labelDistance = length < 6 ? 24 : 9;
    return {
        index,
        x1, y1, x2, y2,
        labelX: x2 + ux * labelDistance,
        labelY: y2 + uy * labelDistance,
        ux, uy,
        from, to,
    };
}

export function drawFieldArrow(
    context: CanvasRenderingContext2D, arrow: FieldArrow,
    active: boolean, shiftX = 0, shiftY = 0
) {
    const x1 = arrow.x1 + shiftX, y1 = arrow.y1 + shiftY;
    const x2 = arrow.x2 + shiftX, y2 = arrow.y2 + shiftY;
    const dx = x2 - x1, dy = y2 - y1;
    const length = Math.hypot(dx, dy);
    const direction = Math.atan2(dy, dx);

    context.save();
    if (length >= 6) {
        const head = Math.min(active ? 18 : 13, length * .65);
        const gradient = context.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, arrow.from);
        gradient.addColorStop(1, arrow.to);
        context.lineCap = "round";
        context.lineWidth = active ? 9 : 5;
        context.strokeStyle = gradient;
        context.shadowColor = active ? arrow.to : "transparent";
        context.shadowBlur = active ? 12 : 0;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2 - Math.cos(direction) * head * .82,
            y2 - Math.sin(direction) * head * .82);
        context.stroke();

        context.fillStyle = arrow.to;
        context.beginPath();
        context.moveTo(x2, y2);
        context.lineTo(x2 - Math.cos(direction - Math.PI / 6) * head,
            y2 - Math.sin(direction - Math.PI / 6) * head);
        context.lineTo(x2 - Math.cos(direction + Math.PI / 6) * head,
            y2 - Math.sin(direction + Math.PI / 6) * head);
        context.closePath();
        context.fill();
    } else {
        context.beginPath();
        context.arc(x1, y1, active ? 5 : 3.5, 0, TAU);
        context.fillStyle = arrow.to;
        context.fill();
        context.lineWidth = 1.5;
        context.strokeStyle = arrow.from;
        context.stroke();
    }

    context.shadowBlur = 0;
    context.font = active ? "bold 13px Arial" : "11px Arial";
    context.fillStyle = "rgba(255, 255, 255, 0.92)";
    context.strokeStyle = "rgba(0, 0, 0, 0.72)";
    context.lineWidth = 3;
    const label = `g${arrow.index + 1}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.strokeText(label, arrow.labelX + shiftX, arrow.labelY + shiftY);
    context.fillText(label, arrow.labelX + shiftX, arrow.labelY + shiftY);
    context.restore();
}
