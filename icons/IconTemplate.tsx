import { Component } from "parvis";

export type IconSizeProps = {
    width?: string;
    height?: string;
}

export const IconTemplate = Component<IconSizeProps & {
    d: string;
    viewBox: string;
}>("IconTemplate", ({ props }) => {
    const { d, width, height, viewBox } = props();
    const svgData = `
    <svg
        aria-hidden="true"
        focusable="false"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="${viewBox}"
        width="${width ?? "12px"}"
        height="${height ?? "12px"}"
    >
        <path fill="currentColor" d="${d}" />
    </svg>
    `;

    return () => <div _html={svgData} />;
});
