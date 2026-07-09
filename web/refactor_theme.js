const fs = require('fs');
const path = require('path');

const directories = [
  'app/[locale]/page.tsx',
  'components/home/HeroSectionWrapper.tsx',
  'components/home/FAQAccordion.tsx',
  'components/PricingCards.tsx',
  'components/layout/Navbar.tsx',
  'components/layout/Footer.tsx',
];

const replacements = [
  // Text
  [/text-zinc-900 dark:text-zinc-50/g, 'text-brand-text'],
  [/text-zinc-800 dark:text-zinc-200/g, 'text-brand-text'],
  [/text-zinc-700 dark:text-zinc-300/g, 'text-brand-text'],
  [/text-zinc-700 dark:text-zinc-100/g, 'text-brand-text'],
  [/text-zinc-500 dark:text-zinc-400/g, 'text-brand-muted'],
  [/text-zinc-500/g, 'text-brand-muted'],
  
  // Backgrounds
  [/bg-white dark:bg-zinc-950/g, 'bg-brand-bg'],
  [/bg-zinc-50 dark:bg-zinc-900\/50/g, 'bg-brand-surface'],
  [/bg-zinc-50 dark:bg-zinc-900/g, 'bg-brand-surface'],
  [/bg-zinc-100 dark:bg-zinc-900\/50/g, 'bg-brand-surface'],
  [/bg-zinc-100 dark:bg-zinc-900/g, 'bg-brand-surface'],
  [/bg-zinc-200 dark:bg-zinc-800/g, 'bg-brand-border'],
  
  // Borders
  [/border-zinc-200 dark:border-zinc-800/g, 'border-brand-border'],
  [/border-zinc-300 dark:border-zinc-700/g, 'border-brand-border'],
  
  // Hovers
  [/hover:bg-zinc-50 dark:hover:bg-zinc-800/g, 'hover:bg-brand-surface/80'],
  [/hover:bg-zinc-100 dark:hover:bg-zinc-800/g, 'hover:bg-brand-surface/80'],
];

directories.forEach(relPath => {
  const filePath = path.join(__dirname, relPath);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(([regex, replacement]) => {
      content = content.replace(regex, replacement);
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + relPath);
  } else {
    console.log('Not found: ' + relPath);
  }
});
