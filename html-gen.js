const fs = require('fs');

const metrikaCode = `<!-- Yandex.Metrika counter --> <script type="text/javascript" > (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}) (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym"); ym(68829679, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, trackHash:true }); </script> <noscript><div><img src="https://mc.yandex.ru/watch/68829679" style="position:absolute; left:-9999px;" alt="" /></div></noscript> <!-- /Yandex.Metrika counter -->`;

const metrika = process.env.ENV === 'prod' ? metrikaCode : '';
const input = process.env.INPUT || 'dist/index.html';
const output = process.env.OUTPUT || 'dist/index.html';

const getHTML = (version) => {
    const template = fs.readFileSync(input).toString();
    return template
        .replace(/%VERSION%/g, version)
        .replace(/%METRIKA%/, metrika);
};

fs.writeFileSync(output, getHTML(process.env.VERSION));
