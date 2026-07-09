const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'components/dashboard'),
  path.join(__dirname, 'components/upload')
];

function fixCards(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixCards(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace bg-brand-bg with bg-brand-surface for all cards/panels
      // Identifying cards by rounded-xl, rounded-2xl, rounded-3xl, shadow, border
      content = content.replace(/bg-brand-bg([^"']*(?:rounded-xl|rounded-2xl|rounded-3xl|shadow|border)[^"']*)/g, 'bg-brand-surface$1');
      content = content.replace(/([^"']*(?:rounded-xl|rounded-2xl|rounded-3xl|shadow|border)[^"']*)bg-brand-bg/g, '$1bg-brand-surface');

      // Exception: the outermost wrapper of DashboardClient should be bg-brand-bg
      // So if it's `<div className="flex h-screen overflow-hidden bg-brand-surface">` we revert it.
      content = content.replace(/className="flex h-screen overflow-hidden bg-brand-surface"/g, 'className="flex h-screen overflow-hidden bg-brand-bg"');

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

dirs.forEach(fixCards);
