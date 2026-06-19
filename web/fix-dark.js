const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['app', 'components'];

const REPLACEMENTS = [
  // Backgrounds
  { pattern: /\bbg-white\b(?!\s*dark:bg-)/g, replacement: 'bg-white dark:bg-zinc-950' },
  { pattern: /\bbg-slate-50\b(?!\s*dark:bg-)/g, replacement: 'bg-zinc-50 dark:bg-zinc-900' },
  { pattern: /\bbg-slate-100\b(?!\s*dark:bg-)/g, replacement: 'bg-zinc-100 dark:bg-zinc-800' },
  { pattern: /\bbg-slate-200\b(?!\s*dark:bg-)/g, replacement: 'bg-zinc-200 dark:bg-zinc-700' },
  { pattern: /\bbg-slate-800\b(?!\s*dark:bg-)/g, replacement: 'bg-zinc-800 dark:bg-zinc-200' },
  { pattern: /\bbg-slate-900\b(?!\s*dark:bg-)/g, replacement: 'bg-zinc-900 dark:bg-zinc-100' },
  { pattern: /\bbg-navy\b(?!\s*dark:bg-)/g, replacement: 'bg-zinc-900 dark:bg-zinc-950' },
  { pattern: /\bbg-navy\/(\d+)\b(?!\s*dark:bg-)/g, replacement: 'bg-zinc-900/$1 dark:bg-zinc-950/$1' },
  { pattern: /\bbg-navy\/\[([^\]]+)\]\b(?!\s*dark:bg-)/g, replacement: 'bg-zinc-900/[$1] dark:bg-zinc-950/[$1]' },

  // Borders
  { pattern: /\bborder-slate-100\b(?!\s*dark:border-)/g, replacement: 'border-zinc-100 dark:border-zinc-800' },
  { pattern: /\bborder-slate-200\b(?!\s*dark:border-)/g, replacement: 'border-zinc-200 dark:border-zinc-800' },
  { pattern: /\bborder-slate-300\b(?!\s*dark:border-)/g, replacement: 'border-zinc-300 dark:border-zinc-700' },
  { pattern: /\bborder-navy\/(\d+)\b(?!\s*dark:border-)/g, replacement: 'border-zinc-900/$1 dark:border-zinc-800' },

  // Text
  { pattern: /\btext-slate-400\b(?!\s*dark:text-)/g, replacement: 'text-zinc-400 dark:text-zinc-500' },
  { pattern: /\btext-slate-500\b(?!\s*dark:text-)/g, replacement: 'text-zinc-500 dark:text-zinc-400' },
  { pattern: /\btext-slate-600\b(?!\s*dark:text-)/g, replacement: 'text-zinc-600 dark:text-zinc-400' },
  { pattern: /\btext-slate-700\b(?!\s*dark:text-)/g, replacement: 'text-zinc-700 dark:text-zinc-300' },
  { pattern: /\btext-slate-800\b(?!\s*dark:text-)/g, replacement: 'text-zinc-800 dark:text-zinc-200' },
  { pattern: /\btext-slate-900\b(?!\s*dark:text-)/g, replacement: 'text-zinc-900 dark:text-zinc-100' },
  { pattern: /\btext-navy\b(?!\s*dark:text-)/g, replacement: 'text-zinc-900 dark:text-zinc-100' },

  // Generic slate to zinc cleanup (for cases missed above)
  { pattern: /\b(bg|text|border|ring|fill|stroke)-slate-/g, replacement: '$1-zinc-' },

  // Hover states
  { pattern: /\bhover:bg-slate-50\b(?!\s*dark:hover:bg-)/g, replacement: 'hover:bg-zinc-50 dark:hover:bg-zinc-900' },
  { pattern: /\bhover:bg-slate-100\b(?!\s*dark:hover:bg-)/g, replacement: 'hover:bg-zinc-100 dark:hover:bg-zinc-800' },
  { pattern: /\bhover:text-slate-900\b(?!\s*dark:hover:text-)/g, replacement: 'hover:text-zinc-900 dark:hover:text-zinc-100' },

  // Specific dashboard/auth fixes
  { pattern: /\bshadow-xl\b/g, replacement: 'shadow-xl dark:shadow-none' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (const { pattern, replacement } of REPLACEMENTS) {
    content = content.replace(pattern, replacement);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

DIRECTORIES.forEach(dir => {
  const fullDir = path.join(__dirname, dir);
  if (fs.existsSync(fullDir)) {
    walkDir(fullDir);
  }
});

console.log("Done adding dark mode zinc classes!");
