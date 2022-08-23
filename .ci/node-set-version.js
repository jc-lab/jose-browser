/**
 * Usage
 *
 * node .ci/set-version.js --package-json packages/backend/package.json 1.2.3
 */

const fs = require('fs');

let packageJsonFile = '';
let version = '';

for (let i = 0; i < process.argv.length; i++) {
    const cur = process.argv[i];
    if (cur === '--package-json') {
        i++;
        packageJsonFile = process.argv[i];
    } else if ((i + 1) === process.argv.length) {
        version = cur;
    }
}

if (!packageJsonFile) {
    console.error('Need --package-json');
    process.exit(1);
}

if (!version) {
    console.error('Need version');
    process.exit(1);
}

const content = JSON.parse(fs.readFileSync(packageJsonFile, { encoding: 'utf8' }));
content.version = version;
fs.writeFileSync(packageJsonFile, JSON.stringify(content, null, 2));

process.exit(0);
