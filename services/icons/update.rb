require 'net/http'
require 'uri'
require 'json'

require 'nokogiri'

list = JSON.parse(IO.read('list.json'))

icons_data = {}

$> = File.open('./icons.log', 'w')

list.keys.each do |url|
    html_link = list[url]['html_link']
    prefix = list[url]['prefix']
    html_path = html_link ? (html_link[0] == '/' ? "#{url}#{html_link}" : html_link) : url;
    html_url = "https://#{html_path}"
    puts html_url

    response = Net::HTTP.get_response(URI(html_url))
    doc = Nokogiri::HTML(response.body)

    if response.code != '200'
        puts "BAD CODE #{response.code}"
    end

    href = ''
    max_size = 0
    doc.css('head link[rel~=icon]').each do |link|
        if link['type'].to_s.start_with?('image/svg')
            href = link['href']
            break
        end
        sizes = link['sizes'] || '1x1'
        size = sizes.split('x')[0].to_i
        if size > max_size
            href = link['href']
            max_size = size
        end
    end
    if href == ''
        href = '/favicon.ico'
    end
    puts max_size
    icons_data[url] = href[0..3] == 'http' ? href : "https://#{url.sub(/\/$/, '').split('/')[0]}#{href[0] == '/' ? '' : '/' }#{prefix || ''}#{href}"
end

$> = File.open('./list.js', 'w')

puts "export const icons = #{JSON.pretty_generate(icons_data)}"
