const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['app', 'components'];

const REPLACEMENTS = [
  { pattern: /\bdark:bg-surface\b/g, replacement: 'dark:bg-zinc-950' },
  { pattern: /\bdark:bg-surface-raised\b/g, replacement: 'dark:bg-zinc-900' },
  { pattern: /\bdark:border-white\/10\b/g, replacement: 'dark:border-zinc-800' },
  { pattern: /\bdark:border-white\/\[0\.07\]\b/g, replacement: 'dark:border-zinc-800' },
  { pattern: /\bdark:text-gray-200\b/g, replacement: 'dark:text-zinc-200' },
  { pattern: /\bdark:text-gray-300\b/g, replacement: 'dark:text-zinc-300' },
  { pattern: /\bdark:text-gray-400\b/g, replacement: 'dark:text-zinc-400' },
  { pattern: /\bdark:text-gray-500\b/g, replacement: 'dark:text-zinc-500' },
  { pattern: /\bdark:text-gray-600\b/g, replacement: 'dark:text-zinc-600' },
  { pattern: /\bdark:text-gray-700\b/g, replacement: 'dark:text-zinc-700' },
  { pattern: /\btext-brand-400\b/g, replacement: 'text-violet-400' },
  { pattern: /\btext-brand-500\b/g, replacement: 'text-violet-500' },
  { pattern: /\bdark:text-brand-400\b/g, replacement: 'dark:text-violet-400' },
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
