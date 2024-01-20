import './About.less';

import user from './user.jpg';

import {
    block,
} from '../../utils';

const b = block('about');

const about = <div class={(b())}>
    <p><img src={(user)} width={100}/></p>
    <p>Программирую</p>
    <p>Работаю в <a href={'https://yandex.ru'}>Яндексе</a></p>
    <p>Люблю математику</p>
    <p>Веду <a href={'https://t.me/nik_alex_flow'}>канал в телеграме</a></p>
    <p>Мой <a href={'https://github.com/nikalexxx'}>Github</a></p>
</div>;

export default about;
