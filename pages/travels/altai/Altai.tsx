import { Breadcrumbs, Gallery } from "../../../components";

import { imgList } from "../../../data/images/travels/altai/list";
import { Lang } from "../../../blocks";
import { Component } from "parvis";

export const Altai = Component("Altai", () => {
    return () => (
        <div>
            <Breadcrumbs
                items={[
                    [<Lang token={`menu/travels`} />, "travels"],
                    ["Алтай"],
                ]}
            />
            <div style={`padding: 15px;`}>
                <p>
                    Алтай, 19-25 апреля 2021 года. Путешествие по окрестностям
                    реки Катунь вблизи горы Малая Синюха. Со стороны правого
                    берега реки — горы с ещё снежными вершинами, по левому
                    берегу — Тавдинские пещеры и Долина гротов, залитые солнцем.
                    Много вечнозелёных сосен, но уже начали распускаться первые
                    цветы и набухать почки на деревьях. Скоро зацветёт
                    маральник, местный цветок, в честь которого даже есть
                    праздник. Вид гор, покрытых ковром цветов, должен быть
                    впечатляющим. Значит не прощаемся, Алтай.
                </p>
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
                    imgPath={"./data/images/travels/altai"}
                />
            </div>
        </div>
    );
});
