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
    `rm -Rf #{small}`
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
    `#{command['webp']}`
    `#{command['jpg']}`
}

$> = File.open('./list.js', 'w')
puts "export const imgList = ["
list.each{|img| puts "\t#{img.to_json},"}
puts "];"
