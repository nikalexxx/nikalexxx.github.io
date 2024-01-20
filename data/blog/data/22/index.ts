import { BookApi } from "@bookbox/preset-web";

export default (_: BookApi) => _.book.root`
${_.header.level(3)`Что такое parvis?`}
Это фреймворк для построения UI приложений.
Работает на технологии virtual dom.

Подробнее про разработку я рассказал в докладе ${_.link.href`https://www.youtube.com/watch?v=RFw8P3LsLcE&t=6246s`(`"Что я узнал, пока писал убийцу реакта?"`)}.


Исходный код открыт, можно посмотреть на гитхабе ${_.link.href`https://github.com/nikalexxx/parvis`}


${_.header.level(3)`Обновления на сайте`}
Этот сайт был полностью переписан на parvis.


Добавлен раздел ${_.link.href`/?/opensource`(`opensource`)}, где я перечислил все открытые библиотеки, которые я написал.


Переработал ${_.link.href`/?/video`('раздел с видео')}, теперь там плиточный дизайн и добавлены больше видео.


В ${_.link.href`projects/unicode``проект юникода`} добавил подсветку юникод групп (подробнее в тг канале ${_.link.href`https://t.me/nik_alex_flow/365`}).



`;
