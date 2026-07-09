const fs = require('fs');
const filePath = 'lib/config/banks.ts';
let content = fs.readFileSync(filePath, 'utf8');
content = content.replace(/ı/g, '');
fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed syntax error by removing injected characters.');
