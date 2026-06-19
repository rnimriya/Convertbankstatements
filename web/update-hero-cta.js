const fs = require('fs');

// 1. Update globals.css with new patterns
const globalsPath = './app/globals.css';
if (fs.existsSync(globalsPath)) {
  let content = fs.readFileSync(globalsPath, 'utf8');

  // Replace graph paper with an attractive plus/dot hybrid grid or better grid
  content = content.replace(
    /\.bg-graph-paper \{[\s\S]*?\}/,
    `.bg-graph-paper {
    background-image: radial-gradient(rgba(15, 23, 42, 0.1) 1.5px, transparent 1.5px), radial-gradient(rgba(15, 23, 42, 0.1) 1.5px, transparent 1.5px);
    background-position: 0 0, 24px 24px;
    background-size: 48px 48px;
  }`
  );
  content = content.replace(
    /\.bg-graph-paper-dark \{[\s\S]*?\}/,
    `.bg-graph-paper-dark {
    background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1.5px, transparent 1.5px), radial-gradient(rgba(255, 255, 255, 0.08) 1.5px, transparent 1.5px);
    background-position: 0 0, 24px 24px;
    background-size: 48px 48px;
  }`
  );

  fs.writeFileSync(globalsPath, content, 'utf8');
}

// 2. Update HeroSection.tsx to have a cooler colorful glow instead of just zinc
const heroPath = './components/home/HeroSection.tsx';
if (fs.existsSync(heroPath)) {
  let content = fs.readFileSync(heroPath, 'utf8');

  content = content.replace(
    'bg-zinc-300 dark:bg-zinc-800 rounded-full blur-[100px]',
    'bg-blue-500 dark:bg-blue-600 rounded-full blur-[120px]'
  );
  // increase opacity slightly for the color to pop
  content = content.replace(
    'opacity-40 dark:opacity-10',
    'opacity-20 dark:opacity-15'
  );

  fs.writeFileSync(heroPath, content, 'utf8');
}

// 3. Update CTA in page.tsx
const pagePath = './app/[locale]/page.tsx';
if (fs.existsSync(pagePath)) {
  let content = fs.readFileSync(pagePath, 'utf8');

  content = content.replace(
    'opacity-10 bg-white dark:bg-zinc-950 rounded-full blur-[100px]',
    'opacity-30 bg-blue-500 rounded-full blur-[120px]'
  );

  fs.writeFileSync(pagePath, content, 'utf8');
}

console.log("Hero and CTA updated");
