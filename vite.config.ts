import { defineConfig, type Plugin } from 'vite';

import { createHtmlPlugin } from 'vite-plugin-html';
import glsl from 'vite-plugin-glsl';

import packageData from './package.json';

const VERSION = packageData.version;

const metrikaCode = `<!-- Yandex.Metrika counter -->
<script type="text/javascript">
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}) (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym"); ym(68829679, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, trackHash:true });
</script>
<noscript>
<div><img src="https://mc.yandex.ru/watch/68829679" style="position:absolute; left:-9999px;" alt="" /></div>
</noscript>
<!-- /Yandex.Metrika counter -->`;

const METRIKA = process.env.ENV === 'prod' ? metrikaCode : '';

// The HTML template lives under assets/, while the app's public routes use /?/<path>.
const devIndexAlias: Plugin = {
    name: 'dev-index-alias',
    configureServer(server) {
        server.middlewares.use((request, _response, next) => {
            if (request.url === '/' || request.url?.startsWith('/?')) {
                request.url = '/assets/index.html' + request.url.slice(1);
            }
            next();
        });
    },
};

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
        devIndexAlias,
        glsl(),
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
