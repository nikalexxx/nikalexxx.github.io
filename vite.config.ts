import { defineConfig } from 'vite';

import { createHtmlPlugin } from 'vite-plugin-html';

import packageData from './package.json';

const VERSION = packageData.version;

const metrikaCode = `<!-- Yandex.Metrika counter --> <script type="text/javascript" > (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}) (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym"); ym(68829679, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, trackHash:true }); </script> <noscript><div><img src="https://mc.yandex.ru/watch/68829679" style="position:absolute; left:-9999px;" alt="" /></div></noscript> <!-- /Yandex.Metrika counter -->`;

const METRIKA = process.env.ENV === 'prod' ? metrikaCode : '';

export default defineConfig({
    esbuild: {
        charset: 'utf8',
    },
    server: {
        port: 1234,
    },
    build: {
        target: 'esnext',
    },
    plugins: [
        createHtmlPlugin({
            template: 'assets/index.html',
            inject: {
                data: {
                    VERSION,
                    METRIKA,
                },
            },
        }),
    ],
    // assetsInclude: 'docs'
});
