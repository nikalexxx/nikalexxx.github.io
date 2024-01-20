import { Breadcrumbs, Gallery } from "../../../components";

import { imgList } from "../../../data/images/travels/smolensk/list";
import { Lang } from "../../../blocks";
import { Component } from "parvis";

export const Smolensk = Component("Smolensk", () => {
    return () => (
        <div>
            <Breadcrumbs
                items={[
                    [<Lang token={`menu/travels`} />, "travels"],
                    ["Смоленск"],
                ]}
            />
            <div style={`padding: 15px;`}>
                <p>Смоленск, 2 октября 2021 года.</p>
                <br />
                <p
                    style={`color: var(--color-text-secondary); font-size: 0.8em; font-style: italic;`}
                >
                    Все приведённые изображения являются моей собственностью и
                    распространяются по лизензии
                    <a
                        href={
                            "https://creativecommons.org/licenses/by-sa/4.0/deed.ru"
                        }
                    >
                        Creative Commons Attribution-ShareAlike 4.0
                        International Public License
                    </a>
                </p>
                <br />
                <Gallery
                    imgList={imgList}
                    imgPath={"./data/images/travels/smolensk"}
                />
            </div>
        </div>
    );
});
