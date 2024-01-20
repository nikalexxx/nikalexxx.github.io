import "./YoutubeVideo.less";

import { block } from "../../utils";
import { Component } from "parvis";

const b = block("youtube-video");

export const YoutubeVideo = Component<{ id: string; }>(
    "YoutubeVideo",
    ({ props }) => {
        return () => {
            const { id } = props();
            return (
                <iframe
                    class={b()}
                    width={560}
                    height={315}
                    src={`https://www.youtube.com/embed/${id}`}
                    title={`YouTube video player`}
                    frameborder={0}
                    allow={`encrypted-media; picture-in-picture`}
                    allowfullscreen={true}
                />
            );
        };
    }
);
