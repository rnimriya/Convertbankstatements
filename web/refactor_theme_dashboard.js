const fs = require('fs');
const path = require('path');

const dashboardDir = path.join(__dirname, 'components/dashboard');
const uploadDir = path.join(__dirname, 'components/upload');

const directoriesToProcess = [dashboardDir, uploadDir];

const replacements = [
  // Text
  [/text-zinc-900 dark:text-zinc-50/g, 'text-brand-text'],
  [/text-zinc-900 dark:text-zinc-100/g, 'text-brand-text'],
  [/text-zinc-900 dark:text-white/g, 'text-brand-text'],
  [/text-zinc-800 dark:text-zinc-200/g, 'text-brand-text'],
  [/text-zinc-700 dark:text-zinc-300/g, 'text-brand-text'],
  [/text-zinc-700 dark:text-zinc-200/g, 'text-brand-text'],
  [/text-zinc-700 dark:text-zinc-100/g, 'text-brand-text'],
  [/text-zinc-600 dark:text-zinc-400/g, 'text-brand-muted'],
  [/text-zinc-500 dark:text-zinc-400/g, 'text-brand-muted'],
  [/text-zinc-400 dark:text-zinc-500/g, 'text-brand-muted'],
  [/text-zinc-500/g, 'text-brand-muted'],
  
  // Backgrounds
  [/bg-white dark:bg-zinc-950/g, 'bg-brand-bg'],
  [/bg-white dark:bg-zinc-900/g, 'bg-brand-bg'],
  [/bg-zinc-50 dark:bg-zinc-950/g, 'bg-brand-bg'],
  [/bg-zinc-50 dark:bg-zinc-900\/50/g, 'bg-brand-surface'],
  [/bg-zinc-50 dark:bg-zinc-900/g, 'bg-brand-surface'],
  [/bg-zinc-100 dark:bg-zinc-900\/50/g, 'bg-brand-surface'],
  [/bg-zinc-100 dark:bg-zinc-900/g, 'bg-brand-surface'],
  [/bg-zinc-100 dark:bg-zinc-800/g, 'bg-brand-surface'],
  [/bg-zinc-200 dark:bg-zinc-800/g, 'bg-brand-border'],
  
  // Borders
  [/border-zinc-200 dark:border-zinc-800/g, 'border-brand-border'],
  [/border-zinc-300 dark:border-zinc-700/g, 'border-brand-border'],
  [/border-zinc-200 dark:border-zinc-700/g, 'border-brand-border'],
  
  // Hovers
  [/hover:bg-zinc-50 dark:hover:bg-zinc-800/g, 'hover:bg-brand-surface/80'],
  [/hover:bg-zinc-100 dark:hover:bg-zinc-800/g, 'hover:bg-brand-surface/80'],
  [/hover:bg-zinc-100 dark:hover:bg-zinc-900/g, 'hover:bg-brand-surface/80'],
  
  // Malformed classes fix
  [/dark:bg-white dark:bg-zinc-950\/10/g, 'dark:bg-brand-bg/10'],
];

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      replacements.forEach(([regex, replacement]) => {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          modified = true;
        }
      });
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated ' + fullPath);
      }
    }
  }
}

directoriesToProcess.forEach(processDirectory);
