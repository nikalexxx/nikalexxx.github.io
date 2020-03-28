const fs = require('fs');

const getHTML = version => {
    const template = fs.readFileSync('index-template.html').toString();
    return template.replace(/__VERSION__/g, version);
}

fs.writeFileSync('index.html', getHTML(process.argv[2]));
