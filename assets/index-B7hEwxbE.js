import{D as I,_ as s,e as t,B as _,L as S,R as B,P as k,b as F,f as b,I as q,N as M}from"./index-DIJPe0d2.js";import{m as L}from"./memo-v39paIJB.js";function z(o,e){return o+e}const N={getX:(o,e)=>e.x-o.x,getY:(o,e)=>e.y-o.y,normalizeX:o=>o.x,normalizeY:o=>o.y,powerK:o=>o};function R(o,e,r=N){const n=e.map(({mass:c,coords:a})=>{const d=r.getX(o.coords,a),y=r.getY(o.coords,a);let m=d**2+y**2;const p=c**(1/3);let x=Math.sqrt(m);m=(x+Math.max(p,1))**2,x=Math.sqrt(m);const u=d/x,$=y/x,f=c/r.powerK(m);return{x:u*f,y:$*f}}),i={x:n.map(c=>c.x).reduce(z),y:n.map(c=>c.y).reduce(z)},h={x:(o.speed?.x??0)+i.x,y:(o.speed?.y??0)+i.y},l={x:o.coords.x+h.x,y:o.coords.y+h.y};return{speed:h,coords:{x:r.normalizeX(l),y:r.normalizeY(l)},acceleration:i}}function G(o,e){o.acceleration||(o.acceleration={x:0,y:0}),o.speed||(o.speed={x:0,y:0});const{coords:r,speed:n,acceleration:i}=e;o.coords.x=r.x,o.coords.y=r.y,o.speed.x=n.x,o.speed.y=n.y,o.acceleration.x=i.x,o.acceleration.y=i.y}function K(o,e=N){const r=o.map((n,i)=>R(n,o.filter((h,l)=>i!==l),e));o.forEach((n,i)=>G(n,r[i]))}const V={getX:(o,e)=>{const r=e.x-o.x;return Math.abs(r)<=250?r:o.x<e.x?e.x-(500+o.x):500+e.x-o.x},getY:(o,e)=>{const r=e.y-o.y;return Math.abs(r)<=250?r:o.y<e.y?e.y-(500+o.y):500+e.y-o.y},normalizeX:o=>(500+o.x)%500,normalizeY:o=>(500+o.y)%500,powerK:o=>Math.sqrt(o)},X=(o,e)=>()=>Math.floor(o+Math.random()*(e-o)),W=L((o,e)=>e!==void 0?X(o,e):X(0,o)),A=F("gravitation"),v=W(500),D=({body:o,showVectors:e,showMass:r})=>{const{mass:n,coords:i,color:h,speed:l,acceleration:c={x:0,y:0}}=o,a=Math.ceil(Math.min(Math.max(n**(1/3)*3,5),100)),d=a/2,y=Math.ceil(Math.sqrt(l.y**2+l.x**2)*10)+a,m=Math.atan2(l.x,l.y),p=Math.ceil(Math.sqrt(c.y**2+c.x**2)*100)+a,x=Math.atan2(c.x,c.y);return s("div",{style:`
        background-color: ${h};
        position: absolute;
        top: ${i.x-d}px;
        left: ${i.y-d}px;
        width: ${a}px;
        height: ${a}px;
        border-radius: 50%;
    `,children:[t("div",{style:`
            position: absolute;
            display: ${e?"block":"none"};
            top: ${d}px;
            left: ${d-y/2}px;
            width: ${y}px;
            height: 1px;
            background: linear-gradient(to right, transparent, transparent 50%, green 50%);
            transform: rotate(${m}rad);
        `}),t("div",{style:`
            position: absolute;
            display: ${e?"block":"none"};
            top: ${d}px;
            left: ${d-p/2}px;
            width: ${p}px;
            height: 1px;
            background: linear-gradient(to right, transparent, transparent 50%, red 50%);
            transform: rotate(${x}rad);
        `}),t("div",{style:`
            background-color: ${h};
            position: absolute;
            top: 0;
            left: 0;
            width: ${a}px;
            height: ${a}px;
            box-shadow: ${n>500?`0 0 20px ${h}`:"none"};
            border-radius: 50%;
        `}),t("div",{style:`
            position: absolute;
            display: ${r?"block":"none"};
            top: ${a}px;
            left: ${a}px;
            font-size: 9px;
        `,children:n})]})},g=I("Space",({props:o,state:e})=>{const[r,n]=e(!1),[i,h]=e(!0),[l,c]=e(!1),[a,d]=e(!1),[y,m]=e(o().list());let p;function x(){const{metrika:u}=o(),$=y();K($,u);const f=r();h(M),f?p=window.requestAnimationFrame(x):p&&window.cancelAnimationFrame(p)}return()=>s("div",{children:[s("div",{class:A("controls"),children:[t(b,{"on:click":()=>{n(M),p=window.requestAnimationFrame(x)},children:t("div",{title:r()?"Pause":"Play",class:A("play"),children:r()?t(q.Pause,{}):t(q.Play,{})})}),s(b,{"on:click":()=>c(M),children:[l()?"Hide":"Show"," ",s("ruby",{style:"color: green;",children:["v ",t("rt",{children:"⟶"})]}),s("ruby",{style:"color: red;",children:["a ",t("rt",{children:"⟶"})]})]}),s(b,{"on:click":()=>d(M),children:[a()?"Hide":"Show"," mass"]}),t(b,{"on:click":()=>{m(o().list()),n(!1)},children:"Reset"})]}),t("div",{class:A("space"),children:y().map(u=>D({body:u,showVectors:l(),showMass:a()}))})]})}),E=()=>[{color:"orange",mass:1e3,coords:{x:250,y:250},speed:{x:0,y:0}},{color:"royalblue",mass:1,coords:{x:140,y:70},speed:{x:-1,y:1}},{color:"brown",mass:5,coords:{x:140,y:150},speed:{x:1,y:-1}}],H=()=>[{color:"orange",mass:1e3,coords:{x:300,y:300},speed:{x:-2,y:0}},{color:"orange",mass:1e3,coords:{x:300,y:200},speed:{x:2,y:0}},{color:"royalblue",mass:2,coords:{x:120,y:250},speed:{x:0,y:3}}],O=()=>[{color:"orange",mass:1e3,coords:{x:300,y:200},speed:{x:0,y:0}},...Array(50).fill(0).map(()=>({color:"royalblue",mass:0,coords:{x:v(),y:v()},speed:{x:(v()-250)/100,y:(v()-250)/100}})).filter(o=>(o.coords.x>320||o.coords.x<280)&&(o.coords.y>220||o.coords.y<180))],Y=L(o=>()=>[{color:"green",mass:o,coords:{x:300,y:100},speed:{x:0,y:0}},{color:"orange",mass:o,coords:{x:300,y:310},speed:{x:0,y:0}},{color:"red",mass:o,coords:{x:200,y:207},speed:{x:0,y:0}}]),T=500,P=22,w=Math.trunc(T/P),j=L(o=>()=>Array.from({length:P-1},(e,r)=>r+1).flatMap(e=>Array.from({length:P-1},(r,n)=>n+1).map(r=>({color:"green",mass:+o+Math.trunc(+o*Math.random()),coords:{x:e*w+Math.random()*w/2,y:r*w+Math.random()*w/2},speed:{x:Math.trunc(3*(.5-Math.random())),y:Math.trunc(3*(.5-Math.random()))}})))),J=I("Gravitation",()=>()=>s("div",{children:[t(_,{items:[[t(S,{token:"menu/physics"}),"physics"],[t(S,{token:"tile/gravitation"})]]}),s("div",{style:"padding: 16px;",children:[s("p",{children:["Читайте"," ",t(B,{href:"blog/20",children:"подробное описание"})," ","реализации в блоге"]}),t("br",{}),s(k,{itemWidth:550,children:[s("div",{children:[t("h3",{children:"1 звезда, 2 планеты"}),t(g,{list:E})]}),s("div",{children:[t("h3",{children:"2 звезды, 1 планета"}),t(g,{list:H})]}),s("div",{children:[t("h3",{children:"Массивная звезда, много планет"}),t("p",{children:"Планеты со случайным расположениями и скоростями, их массы бесконечно малы по сравнению с центральной звездой"}),t(g,{list:O})]})]}),t("br",{}),t("h3",{children:"Задача трёх тел"}),s(k,{itemWidth:550,children:[s("div",{children:[t("p",{children:"Классическая иллюстрация, 3 тела с нулевыми скоростями"}),t("br",{}),t(g,{list:Y(200)})]}),s("div",{children:[t("p",{children:"Гравитация на плоскости, свёрнутой в тор (концы склеены), где сила притяжения обратно пропорциональна не квадрату расстояния, а просто расстоянию."}),t("br",{}),t(g,{list:Y(1),metrika:V})]})]}),t("h3",{children:"N тел"}),t(k,{itemWidth:550,children:s("div",{children:[t("p",{children:"N тел со случайными скоростями. После первого схлопывания некоторые тела разлетаются, другие образуют плотное облако."}),t("br",{}),t(g,{list:j(2)})]})})]})]}));export{J as Gravitation};
