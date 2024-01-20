import "./Video.less";

import { block } from "../../utils";
import { PageGrid, Tile, YoutubeVideo } from "../../components";
import { Collapse, Lang, Message } from "../../blocks";
import { Component } from "parvis";
import { videoList } from "./data";

const b = block("video");

export const Video = Component("Video", () => {
    return () => {
        return (
            <div class={b()}>
                <h2>
                    <Lang token={`menu/video`} />
                </h2>
                <div>
                    <p>
                        Видео по typescript лучше смотреть самые свежие, они
                        наиболее полные и структурированные
                    </p>
                    <br />
                    <PageGrid itemWidth={400}>
                        {videoList.map((video) => {
                            const { youtubeId, youtubeLink, description, textLink, presentationLink } =
                                video;
                            const cleanId = youtubeId.replace(/\?.*/, "");
                            const bgUrl = `https://i.ytimg.com/vi/${cleanId}/hqdefault.jpg`;

                            const isLongDescription = description.length > 100;
                            const shortDescription = description.slice(0, 100);
                            const descriptionContent = (
                                <Message text={description} />
                            );
                            return (
                                <Tile>
                                    <div class={b("video")}>
                                        <a
                                            href={
                                                youtubeLink ??
                                                `https://www.youtube.com/watch?v=${youtubeId}`
                                            }
                                            style={`background-image: url(${bgUrl})`}
                                            class={b("image")}
                                            rel={"noopener noreffere"}
                                            target={"_blank"}
                                        >
                                            <h3>{video.title}</h3>
                                        </a>
                                        {isLongDescription ? (
                                            <Collapse title={shortDescription + '...'}>
                                                {descriptionContent}
                                            </Collapse>
                                        ) : (
                                            descriptionContent
                                        )}
                                        <br />
                                        {textLink && (
                                            <>
                                                <a href={textLink}>
                                                    Текстовая расшифровка
                                                </a>
                                                <br />
                                                <br />
                                            </>
                                        )}
                                        {presentationLink && (
                                            <>
                                                <a href={presentationLink}>
                                                    Презентация
                                                </a>
                                                <br />
                                                <br />
                                            </>
                                        )}
                                    </div>
                                </Tile>
                            );
                        })}
                    </PageGrid>
                </div>
            </div>
        );
    };
});
