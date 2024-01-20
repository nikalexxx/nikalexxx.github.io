import "./Opensource.less";

import { block, RouteLink } from "../../utils";
import { ExternalLink, Lang, Message } from "../../blocks";
import { Component } from "parvis";
import { PageGrid, Tile } from "../../components";
import { codeList } from "./data";

const b = block("opensource");

export const Opensource = Component("Opensource", () => {
    return () => {
        return (
            <div class={b()}>
                <h2>
                    <Lang token={`menu/opensource`} />
                </h2>
                <PageGrid itemWidth={500}>
                    {codeList.map((item) => {
                        const { title, description, codeLinks, artefactLinks, links } = item;

                        return (
                            <Tile className={b("tile")}>
                                <h2>{title}</h2>
                                <p>
                                    <Message text={description} />
                                </p>
                                <p>
                                    {links?.map((link) => (
                                        <ExternalLink href={link}>{link}</ExternalLink>
                                    ))}
                                </p>
                                <p>
                                    {codeLinks?.map((link) => (
                                        <ExternalLink href={link}>{link}</ExternalLink>
                                    ))}
                                </p>
                                <p>
                                    {artefactLinks?.map((link) => (
                                        <ExternalLink href={link}>{link}</ExternalLink>
                                    ))}
                                </p>
                            </Tile>
                        );
                    })}
                </PageGrid>
            </div>
        );
    };
});
