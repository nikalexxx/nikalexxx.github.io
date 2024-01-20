import { Breadcrumbs, Gallery } from "../../../components";

import { imgList } from "../../../data/images/travels/krasnodar-krai/list";
import { Lang } from "../../../blocks";
import { Component } from "parvis";

export const KrasnodarKrai = Component("KrasnodarKrai", () => {
    return () => (
        <div>
            <Breadcrumbs
                items={[
                    [<Lang token={`menu/travels`} />, "travels"],
                    ["Краснодарский край"],
                ]}
            />
            <div style={`padding: 15px;`}>
                <p>Краснодарский край, 7-23 августа 2021 года.</p>
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
                    imgPath={"./data/images/travels/krasnodar-krai"}
                />
            </div>
        </div>
    );
});
