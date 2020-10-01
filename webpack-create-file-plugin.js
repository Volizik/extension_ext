const fs = require('fs');
const path = require('path');

const fileContent = (fileName) => `'use strict';
    
const script = document.createElement('script');
script.setAttribute("type", "module");
script.setAttribute("src", chrome.extension.getURL('${fileName}.bundle.js'));
const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
head.insertBefore(script, head.firstChild);
`;

class WebpackCreateFilePlugin {
    constructor(fileNames) {
        this.fileNames = fileNames;
    }

    apply(compiler) {
        compiler.hooks.done.tap('Webpack Create File Plugin', () => {
            this.fileNames.forEach(name => {
                fs.writeFileSync(path.resolve(__dirname, 'dist', `${name}.js`), fileContent(name));
            });
        });
    }
}

module.exports = WebpackCreateFilePlugin;
