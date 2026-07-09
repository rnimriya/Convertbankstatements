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
  if (filePath.includes('node_modules') || filePath.includes('.next')) return;
  if (!['.tsx', '.ts', '.html', '.json', '.txt'].some(ext => filePath.endsWith(ext))) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    .replace(/₹0/g, '$0')
    .replace(/₹25/g, '$5')
    .replace(/₹248/g, '$48')
    .replace(/₹21/g, '$4')
    .replace(/₹1,198/g, '$20')
    .replace(/₹11,499/g, '$192')
    .replace(/₹958/g, '$16')
    .replace(/₹4,498/g, '$75')
    .replace(/₹43,178/g, '$720')
    .replace(/₹3,598/g, '$60')
    .replace(/₹49/g, '$1')
    .replace(/₹399/g, '$20')
    .replace(/₹999/g, '$75');

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated', filePath);
  }
});
