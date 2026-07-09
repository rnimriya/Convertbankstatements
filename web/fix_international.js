const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('g:/Latest Project/Convertbank/web', (filePath) => {
  if (filePath.includes('node_modules') || filePath.includes('.next') || filePath.includes('banks.ts')) return;
  if (!['.tsx', '.ts', '.html', '.json', '.txt'].some(ext => filePath.endsWith(ext))) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    .replace(/30\+ Indian banks/g, 'Global banks')
    .replace(/Indian bank/g, 'bank')
    .replace(/Indian banks/g, 'banks')
    .replace(/Indian Bank/g, 'Bank')
    .replace(/Indian Banks/g, 'Banks');

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated', filePath);
  }
});
