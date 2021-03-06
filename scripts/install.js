#!/usr/bin/env node

var fs = require('fs-extra');

console.log("=============================================");
console.log("Starting WordPress Hybrid Client Installation");
console.log("=============================================");

copy('../dist/config.cson', '../config/config.cson');
copy('../dist/config.dev.cson', '../config/config.dev.cson');
copy('../dist/menu.json', '../config/menu.json');
copy('../dist/config.xml', '../config.xml');
copy('../dist/ionic.config.json', '../ionic.config.json');
copy('../dist/config.scss', '../config/config.scss');
copy('../dist/components', '../config/components');
copy('../dist/providers', '../config/providers');
copy('../dist/pages', '../config/pages');
copy('../dist/assets', '../config/assets');
copy('../dist/theme', '../config/theme');
copy('../dist/manifest.json', '../config/manifest.json');
copy('../dist/index.html', '../config/index.html');
copy('../dist/ngsw-manifest.json', '../config/ngsw-manifest.json');
copy('../release.sh.dist', '../release.sh');

function copy(source, target, overwrite) {
    if (!overwrite && fs.existsSync(target)) {
        console.log('the destination already exist, will not overwrite: ' + target);
        return;
    }
    fs.copy(source, target, function(err) {
        if (err) return console.error(err)
        console.log('success: ' + target)
    })
}
