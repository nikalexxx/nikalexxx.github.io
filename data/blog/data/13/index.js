export default api => {
    const {book, text, block} = api;
    const {h, a, code} = text;
    const {pre} = block;
    return book`
Недавно я летал на Алтай, и у меня накопились фото с природой.
Решил сделать галерею изображений и рассказать о технических моментах.

Посмотреть на конечный результат можно ${a.href('?/travels/altai')`здесь`}.


${h(3)`Подготовка изображений`}
Оригиналы изображений все были размером 3000x4000 (и альбомной, и портретной ориентации).
Грузить все изображения на одну страницу — значит бездумно расходовать трафик.
Для каждого изображения я создал его маленькие копии (${code`jpg`} и ${code`webp`}), которые бы вписывались в прямоугольник 320x240 (ориентация сохраняется, то есть для вертикальных фото прямоугольник имел вид 240x320).


Так как сайт статический, все изображения должны быть получены заранее.
Я использовал возможности утилиты ${a.href('https://ffmpeg.org/')`ffmpeg`} для конвертации формата и масштабирования.
Помимо этого, я создал список изображений ${code`list.js`} с указанием их имени, расширения и размеров.


Формат списка:
${pre`
type ImgList = Array<{
    name: string;
    extension: string;
    width: number;
    height: number;
}>;
`}

Структура директорий фиксированная, имеет вид
${pre`
// tree -L 1
.
├── list.js <- сгенерированный список
├── original/ <- оригиналы изображений
└── small/ <- уменьшенные копии
`}


Запишем значения уменьшенных сторон в ${code`config.json`}
${pre`
{
    "longSize": 320,
    "shortSize": 240
}
`}

Для запуска использовал ${a.href('https://www.ruby-lang.org/ru/')`ruby`}. Создадим файл ${code`generate.rb`}

${pre`
require 'json'
require 'dimensions'


original = 'original'
small = 'small'
extensions = ['jpg', 'png']


Dir.chdir(File.expand_path(File.dirname(__FILE__)))


config = JSON.parse(IO.read('config.json'))
longSize = config['longSize']
shortSize = config['shortSize']


Dir.chdir(ENV['IMG_DIR'])
Dir.chdir("./#{original}")
list = Dir.glob("*.{#{extensions.join(',')}}").map{|path|
    list = path.split('.')
    name = list[0..-2].join('.')
    extension = list[-1]
    dimensions = Dimensions.dimensions(path)

    {name: name, extension: extension, width: dimensions[0], height: dimensions[1]}
}


Dir.chdir('..')


if Dir.exist?(small)
    \`rm -Rf #{small}\`
    Dir.mkdir(small)
end


list.each{|item|
    name = item[:name]
    extension = item[:extension]

    isVertical = item[:height] > item[:width]
    width = isVertical ? shortSize : longSize
    height = isVertical ? longSize : shortSize
    ratio_view = "#{width}/#{height}"

    command = ->(target_extension){
        "ffmpeg -i #{original}/#{name}.#{extension} -vf scale=\"'if(gt(a,#{ratio_view}),#{width},-1)':'if(gt(a,#{ratio_view}),-1,#{height})'\" #{small}/#{name}.#{target_extension}"
    }

    # генерация изображений
    \`#{command['webp']}\`
    \`#{command['jpg']}\`
}


$> = File.open('./list.js', 'w')
puts "export const imgList = ["
list.each{|img| puts "\t#{img.to_json},"}
puts "];"
`}


Настроим локальное окружение, создадим Gemfile
${pre`
source 'https://rubygems.org'
gem 'dimensions'
`}
и установим зависимости ${code`bundle install`}


Пример запуска
${pre`
IMG_DIR=../../data/images/travels/altai bundle exec ruby generate.rb
`}


${h(3)`Компонент галереи`}
Когда картинки готовы, приступим к браузерной стороне.


Мы хотим создать сетку из маленьких превью, и по клику показывать просмотрщик с оригинальным изображением.
Используем grid для построения.


Шаг сетки делаем адаптивным к размерам окна, минимум 100px плюс 10% ширины.

${pre`
--size: calc(100px + 10vw);
display: grid;
grid-template-columns: repeat(auto-fit, minmax(var(--size), 1fr));
gap: 4px;
`}

Для каждой плитки маленькое изображение будет фоном.
Его надо растянуть по размерам блока.
Сам блок должен иметь вариативную высоту.
Ну и добавить эффект раздутия при наведении

${pre`
background-position: center;
background-size: cover;
background-clip: padding-box;
height: var(--size);
--offset: 4px;
margin: var(--offset);
border-radius: 8px;


&:hover {
    cursor: pointer;
    margin: 0;
    padding: var(--offset);
}
`}

Чтобы загрузить картинку для фона, предварительно проверим, поддерживает ли браузер ${a.href('https://ru.wikipedia.org/wiki/WebP')`webp`} изображения.


Для этого создадим изображение webp высотой 2 пикселя и проверим, сможет ли браузер его обработать.
${pre`
function checkWebpSupport(callback) {
    const webpImg = new Image();

    const check = () => callback(webpImg.height === 2);
    webpImg.onload = check;
    webpImg.onerror = check;

    webpImg.src =
        'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
}
`}


${h(3)`Просмотрщик изображений`}
При клике открывается модальное окно.
Я написал отдельный компонент для этого, реализацию можно посмотреть на ${a.href('?/design/components')`странице компонентов`}.


Уже внутри него помещается просмотрщик изображения.
Главная его работа в том, чтобы растягивать изображение на всю доступную область браузера.

Ищется максимальный ограничивающий прямоугольник с соотношением сторон, аналогичным оригинальной картинке (помним, что все ширины и высоты нам известны ещё с этапа генерации).

Вместе с тем и ширина, и высота ограничиваются размерами окна.
${pre`
&__image {
    max-width: 100vw;
    max-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
`}
В этих рамках и помещается изображение.


Так как для каждого изображения соотношения сторон разные, то стили вычисляем динамически.
Ниже приведён исходный код метода рендера компонента.
${pre`
const { path, height, width, close } = props();


const isVertical = height > width;
const short = isVertical ? width : height;
const long = isVertical ? height : width;


const ratio = long / short;


return E.div
    .class(b('image'))
    .onClick(() => {
        close();
    })
    .style(
        \`\${isVertical ? 'height' : 'width'}: 100v\${
            isVertical ? 'h' : 'w' // бо´льшую сторону растягиваем на максимум
        }; \${isVertical ? 'width' : 'height'}: \${100 / ratio}v\${
            isVertical ? 'h' : 'w' // меньшую масштабируем
        }\`
    )(
    E.img
        .src(path)
        .alt(path)
        // растягиваем саму картинку с сохранением пропорций
        .style(\`\${isVertical ? 'width' : 'height'}: 100%\`)
        .onClick((e) => e.stopPropagation()),
    E.div.class(b('close'))(Icon.Times.width\`20px\`.height\`20px\`)
)
`}
`};
