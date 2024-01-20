import "./Physics.less";

import { RouteLink, block } from "../../utils";
import { PageGrid, Tile } from "../../components";

import { Lang } from "../../blocks";
import { Component } from "parvis";

const b = block("physics");

const Physics = Component("Physics", () => {
  return () => {
    return (
      <div class={b()}>
        <h2>
          <Lang token={`menu/physics`} />
        </h2>
        <PageGrid>
          <RouteLink href={"physics/standard-model"}>
            <Tile>
              <div>
                <Lang
                  token={`tile/standart-model`}
                  view={(e) => <div style={`text-align: center`}>{e}</div>}
                />
                <div class={b("particles")}>
                  e<sup>–</sup>, γ, H
                </div>
              </div>
            </Tile>
          </RouteLink>
          <RouteLink href={"physics/gravitation"}>
            <Tile>
              <div>
                <Lang token={`tile/gravitation`} />
                <div class={b("space")}>
                  <div class={b("sun")} />
                  <div class={b("orbit")}>
                    <div class={b("planet")} />
                  </div>
                </div>
              </div>
            </Tile>
          </RouteLink>
        </PageGrid>
      </div>
    );
  };
});

export default Physics;
